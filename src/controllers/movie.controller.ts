/* eslint-disable @typescript-eslint/naming-convention */
// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {MovieServiceBindings} from '../keys';
import {Video} from '../models';
import {MovieService} from '../services/movie.service';

// import {inject} from '@loopback/core';

export class MovieController {
  constructor(
    @inject(MovieServiceBindings.MOVIE_SERVICE)
    private movieService: MovieService,
  ) {}

  @get('/movie/trailer/{movieName}')
  @response(200, {
    description: 'Movie trailer url',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Video),
      },
    },
  })
  async getMovieByName(@param.path.string('movieName') movieName: string) {
    return this.movieService.findByByName(movieName);
  }
}
