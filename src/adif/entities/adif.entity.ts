import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'adif_records' })
export class AdifRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'rst_rcvd', type: 'varchar', length: 10 })
  rstRcvd!: string;

  @Column({ name: 'rst_sent', type: 'varchar', length: 10 })
  rstSent!: string;

  @Column({ name: 'call', type: 'varchar', length: 20 })
  call!: string;

  @Column({ name: 'operator', type: 'varchar', length: 20 })
  operator!: string;

  @Column({ name: 'time_on', type: 'varchar', length: 10 })
  timeOn!: string;

  @Column({ name: 'qso_date', type: 'varchar', length: 12 })
  qsoDate!: string;

  @Column({ name: 'freq', type: 'varchar', length: 20 })
  freq!: string;

  @Column({ name: 'band', type: 'varchar', length: 10 })
  band!: string;

  @Column({ name: 'mode', type: 'varchar', length: 10 })
  mode!: string;

  @Column({ name: 'tx_pwr', type: 'varchar', length: 10 })
  txPwr!: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'grid_square', type: 'varchar', length: 10 })
  gridSquare!: string;

  @Column({ name: 'state', type: 'varchar', length: 10 })
  state!: string;

  @Column({ name: 'qth', type: 'varchar', length: 50 })
  qth!: string;

  @Column({ name: 'country', type: 'varchar', length: 50 })
  country!: string;

  @Column({ name: 'cnty', type: 'varchar', length: 50 })
  cnty!: string;

  @Column({ name: 'my_gridsquare', type: 'varchar', length: 10 })
  myGridSquare!: string;

  // Optional fields can be null
  @Column({ name: 'sig_info', type: 'varchar', length: 200, nullable: true })
  sigInfo?: string;

  @Column({ name: 'my_sig_info', type: 'varchar', length: 200, nullable: true })
  mySigInfo?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'comment', type: 'text', nullable: true })
  comment?: string;
}
