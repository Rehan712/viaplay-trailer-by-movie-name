import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ViaplayDataSource} from '../datasources';
import {Video, VideoRelations} from '../models';

export class VideoRepository extends DefaultCrudRepository<
  Video,
  typeof Video.prototype.id,
  VideoRelations
> {
  constructor(
    @inject('datasources.viaplay') dataSource: ViaplayDataSource,
  ) {
    super(Video, dataSource);
  }
}
