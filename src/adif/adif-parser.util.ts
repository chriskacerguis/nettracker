// src/adif/adif-parser.util.ts

import { BadRequestException } from '@nestjs/common';

/**
 * Parse a single “record block” (everything between tags up to the next <EOR>).
 * This function walks through the text, finds length‐prefixed tags (<TAG:nnn>),
 * reads exactly nnn characters for the value (regardless of line breaks),
 * then repeats until no more tags remain in this block.
 *
 * @param block  A string containing one ADIF “record” (everything up to <EOR>).
 * @returns      A Record<string,string> mapping upper‐case tag → field value.
 */
export function parseOneRecord(block: string): Record<string, string> {
  const result: Record<string, string> = {};
  let idx = 0;
  const len = block.length;

  // Helper to skip any whitespace or newlines
  function skipWhitespace() {
    while (idx < len && (block[idx] === '\n' || block[idx] === '\r' || block[idx] === ' ' || block[idx] === '\t')) {
      idx++;
    }
  }

  skipWhitespace();
  while (idx < len) {
    // Look for a '<'
    if (block[idx] !== '<') {
      // If we’re not at a '<', it means we’ve reached leftover junk or trailing whitespace
      break;
    }
    idx++; // skip '<'

    // Read the tag name up to ':' or '>'
    let tagName = '';
    while (idx < len && block[idx] !== ':' && block[idx] !== '>') {
      tagName += block[idx++];
    }
    tagName = tagName.trim().toUpperCase();

    if (idx >= len) break;

    // If the next character is '>', it’s a zero‐length field (e.g. <TAG:0>)
    // but ADIF always uses <TAG:length>, so we expect a colon.
    if (block[idx] !== ':') {
      // Malformed tag (no length delimiter). Skip until next '>' and continue.
      while (idx < len && block[idx] !== '>') idx++;
      if (idx < len) idx++;
      skipWhitespace();
      continue;
    }

    idx++; // skip ':'

    // Read digits for length
    let lenDigits = '';
    while (idx < len && /\d/.test(block[idx])) {
      lenDigits += block[idx++];
    }
    const valueLength = parseInt(lenDigits, 10);
    if (Number.isNaN(valueLength)) {
      // Bad length—skip until '>' and continue
      while (idx < len && block[idx] !== '>') idx++;
      if (idx < len) idx++;
      skipWhitespace();
      continue;
    }

    // Next character should be '>'—skip it
    if (idx < len && block[idx] === '>') {
      idx++;
    } else {
      // Unexpected format; skip until next '>' and continue
      while (idx < len && block[idx] !== '>') idx++;
      if (idx < len) idx++;
      skipWhitespace();
      continue;
    }

    // Now read exactly valueLength characters for the tag’s value
    const value = block.slice(idx, idx + valueLength);
    idx += valueLength;

    // Store it (overwrite if duplicate tags appear)
    result[tagName] = value;

    skipWhitespace();
  }

  return result;
}

/**
 * Given an entire ADIF file content (UTF-8 string),
 * split on <EOR> (case-insensitive), parse each chunk, and return an Array of record‐objects.
 *
 * @param adifText  Whole ADIF file as a string
 * @returns         Array of Record<string,string>, one per <EOR>
 */
export function parseAdifText(adifText: string): Array<Record<string, string>> {
  // Split on <EOR> (case-insensitive). Keep chunks non-empty.
  const rawBlocks = adifText
    .split(/<EOR>/i)
    .map((blk) => blk.trim())
    .filter((blk) => blk.length > 0);

  const allRecords: Array<Record<string, string>> = [];
  for (const block of rawBlocks) {
    try {
      const parsed = parseOneRecord(block);
      allRecords.push(parsed);
    } catch (e: any) {
      // If parsing one record fails (unlikely with robust logic), wrap in HTTP 400
      throw new BadRequestException(`Failed to parse one ADIF record: ${e.message}`);
    }
  }
  return allRecords;
}
