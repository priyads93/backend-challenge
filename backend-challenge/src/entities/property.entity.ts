import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';
import { Node } from './node.entity';

@Entity()
export class Property extends AbstractEntity<Property> {
  @Column()
  name: string;

  @Column('float')
  value: number;

  @ManyToOne(() => Node, (node) => node.properties)
  node: Node;

  @Column()
  nodeId: number;
}
