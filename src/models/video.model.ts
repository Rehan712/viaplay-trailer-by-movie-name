import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Video extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  imdbId: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  key: string;

  @property({
    type: 'string',
  })
  url: string;

  @property({
    type: 'string',
  })
  site: string;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: '$now',
  })
  updatedAt?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
