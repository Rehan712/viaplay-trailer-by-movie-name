/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import axios, {Axios, AxiosResponse} from 'axios';
import {Video} from '../models';
import {VideoRepository} from '../repositories';
import {MovieDBResponse} from '../types';

export class MovieService {
  private axios: Axios;
  private apiKey?: string;
  constructor(
    @repository(VideoRepository) private videoRepository: VideoRepository,
  ) {
    this.apiKey = process.env.MOVIE_DB_API_KEY;
    this.axios = axios.create({
      baseURL: 'https://api.themoviedb.org',
      params: {
        api_key: this.apiKey,
        append_to_response: 'videos',
      },
    });
  }
  async findMovieByViaplay(name: string) {
    const res = await axios.get(
      `https://content.viaplay.se/pc-se/film/${name}`,
    );
    return res.data;
  }

  async findByByName(name: string) {
    if (!this.apiKey)
      throw new HttpErrors.UnprocessableEntity(
        'please set themoviedb api key in MOVIE_DB_API_KEY env variable',
      );
    try {
      const foundMovie = await this.videoRepository.findOne({where: {name}});
      if (foundMovie) return foundMovie;
      const movie = await this.findMovieByViaplay(name);
      if (!movie) throw new HttpErrors.NotFound('Movie not found');
      const imdbId =
        movie._embedded['viaplay:blocks']?.[0]._embedded['viaplay:product']
          ?.content?.imdb.id;
      if (!imdbId) throw new HttpErrors.NotFound('Movie not found');
      const res: AxiosResponse<MovieDBResponse.RootObject> =
        await this.axios.get(`/3/movie/${imdbId}`);
      if (!res.data) throw new HttpErrors.NotFound('Movie not found');
      const trailerVideo = res.data?.videos?.results?.find(
        video => video.name === 'Trailer' && video.type === 'Trailer',
      );
      if (!trailerVideo) throw new HttpErrors.NotFound('Trailer not found');
      const video: Partial<Video> = {
        name,
        imdbId,
        key: trailerVideo.key,
        url: `https://youtube.com/watch?v=${trailerVideo.key}`,
        site: trailerVideo.site,
      };
      const createdVideo = await this.videoRepository.create(video);
      return createdVideo;
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        err.response.data?.status_message ?? 'unable to get movie by name',
      );
    }
  }
}
