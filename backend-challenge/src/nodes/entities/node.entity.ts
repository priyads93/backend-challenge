import {
  Column,
  Entity,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity()
@Tree('materialized-path')
export class Node extends AbstractEntity<Node> {
  @Column()
  name: string;

  @OneToMany(() => Property, (property) => property.node, { cascade: true })
  properties: Property[];

  @TreeChildren({ cascade: true })
  children: Node[];

  @TreeParent()
  parent: Node;
}
