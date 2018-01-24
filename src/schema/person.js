export const Person = `
  type Person {
    id: ID!
    name: String
    popularity: Float
    known_for: [Media]

}

interface Media {
  id: ID!
  title: String!
  media_type: String!
}

type Movie implements Media {
  id: ID!
  title: String!
  media_type: String!
  duration: Int!
  box_office: Int!
}

type TVShow implements Media {
  id: ID!
  title: String!
  media_type: String!
  episodes: [Episode]!
  running: Boolean
}

`
