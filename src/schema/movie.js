import { makeExecutableSchema } from 'graphql-tools';

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
      movies: () => movies,
      persons: () => persons,
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
