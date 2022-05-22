import {BindingKey} from '@loopback/core';
import {MovieService} from './services/movie.service';

export namespace MovieServiceBindings {
  export const MOVIE_SERVICE = BindingKey.create<MovieService>(
    'services.movie.service',
  );
}
