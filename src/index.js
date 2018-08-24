const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_, { id }) => links.find(l => l.id === id)
  },
  Mutation: {
    post: (root, { description, url }) => {
      const link = {
        id: `link-${idCount++}`,
        description,
        url
      }
      links.push(link)
      return link
    },
    updateLink: (root, { id, url, description }) => {
      let updatedLink = null
      links.some(l => {
        if (l.id === id) {
          if (url) {
            l.url = url
          }
          if (description) {
            l.description = description
          }
          updatedLink = l
          return true
        }
      })
      return updatedLink
    },
    deleteLink: (root, { id }) => {
      let deletedLink = null
      links.some(l => {
        if (l.id === id) {
          deletedLink = Object.assign({}, l)
          delete links[links.indexOf(l)]
          return true
        }
      })
      return deletedLink
    }
  }
	// We can omit this resolvers since the server knows them thanks to the schema.
  // Link: {
  //   id: (root) => root.id,
  //   description: (root) => root.description,
  //   url: (root) => root.url,
  // }
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers
})
server.start(() => console.log(`Server is running on http://localhost:4000`))