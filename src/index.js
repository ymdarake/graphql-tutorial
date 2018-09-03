const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')


const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    /**
     * @param context {object} object that every resolver in the resolver chain can read from and write to.
     * @param info {object} object that carries information about the incoming GraphQL query (in the form of a query AST).
     * 
     * here, info is a selectionSet such as 
     * `{
     *    id
     *    description
     *    url
     * }`
     */
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
  },
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      //TODO: use .env in the same way as database/prisma.yml
      endpoint: 'https://us1.prisma.sh/ym-darake-bc1db0/database/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))