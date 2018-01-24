import { makeExecutableSchema } from 'graphql-tools';
import http from 'request-promise-json';

const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const typeDefs = `
  interface Media {
    id: ID!
    title: String!
    media_type: String!
  }

  type Movie implements Media {
    id: ID!
    title: String!
    imdb_id: String!
    media_type: String!
    duration: Int!
    box_office: Int!
    votes: Int!
  }

  type Person {
    id: ID!
    name: String
    popularity: Float
    known_for: [Media]

  }

  type Query {
    movies: [Movie]
    movie(id: ID, title: String, imdb_id: String!): Movie
    persons: [Person]
    person(id: ID, name: String, popularity: Float): Person
  }

  type Mutation {
    upvoteMovie (
      MovieId: Int!
    ): Movie
  }
  `

  const resolvers = {
    Query: {
      movie: async (obj, args, context, info) => {
        if (args.id) {
          return http
            .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
        }
        if (args.imdb_id) {
          const results = await http
            .get(`https://api.themoviedb.org/3/find/${args.imdb_id}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`)

          if (results.movie_results.length > 0) {
            const movieId = results.movie_results[0].id
            return http
              .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
          }
        }
      }
    },
    Mutation: {
      upvoteMovie: (_, { movieId }) => {
        const movie = find(movies, { id: movieId });
        if (!movie) {
          throw new Error(`Couldn't find movie with id ${movieId}`);
        }
        movie.votes += 1;
        return movie;
      },
    },
    // Author: {
    //   posts: (author) => filter(posts, { authorId: author.id }),
    // },
    // Post: {
    //   author: (post) => find(authors, { id: post.authorId }),
    // },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  export default schema
