const graphql = require("graphql");
const { user } = "s.graphql";
console.log(user);
const _ = require("lodash");

//importing the model schema for mongodb
const Author_schema = require("../utils/mod/Author");
const booksdb_schema = require("../utils/mod/books_db");
const { saveDataToDynamicFile } = require("../utils/mod/DataHandelConfig");
const books_db = require("../utils/mod/books_db");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const graphnodes = new GraphQLObjectType({
  name: "GraphNodes",
  description: "This is first node of graph",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    numOnode: { type: GraphQLInt },
  }),
}); // this is a dummy object

//save in refrence data file
const ref_jsonFileName = "refrenceData.json";

//node for author
const Author_type = new GraphQLObjectType({
  name: "Author",
  description: "author of book",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(Books_type),
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        const books_Mdb = await books_db.find({
          authorid: { $eq: parent._id },
        });

        return books_Mdb;
      },
    },
  }),
});

//node for book
const Books_type = new GraphQLObjectType({
  name: "Book",
  description: "books in library",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLString },
    authorid: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

//root query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "root query",
  fields: {
    Author: {
      type: Author_type,
      args: { _id: { type: GraphQLString } },
      resolve: async (parent, args) => {
        AuthorObjectFromMonogdb = await Author_schema.findById(args._id);
        return AuthorObjectFromMonogdb;
      },
    },
  },
});

//mutation section
const mutation = new GraphQLObjectType({
  name: "mutation",
  description: "set data",
  fields: {
    createBooks: {
      type: Books_type,
      args: {
        name: { type: GraphQLString },
        authorid: { type: GraphQLString },
        genre: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const Mbook = new booksdb_schema({
          name: args.name,
          authorid: args.authorid,
          genre: args.genre,
        });

        //check if id is present
        let ref_MDBooks = await booksdb_schema.find({
          name: { $eq: args.name },
        });
        if (ref_MDBooks.length === 0) {
          const ref_MDb = await Mbook.save();
          console.log("type", typeof ref_MDb);
          //save the refrence to the file

          const key = ref_MDb.name; //to make key dynamic
          const data = { [key]: ref_MDb._id || {} };

          saveDataToDynamicFile(data, ref_jsonFileName, false);

          console.log("book saved", ref_MDb);
          return ref_MDb;
        }
        console.log("book already present", ref_MDBooks);

        return ref_MDBooks[0];
      },
    },
    createAuthor: {
      type: Author_type,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        const MAuthor = new Author_schema({
          name: args.name,
          age: args.age,
        });

        //check if id is present
        let ref_MDAuthors = await Author_schema.find({
          name: { $eq: args.name },
        });
        if (ref_MDAuthors.length === 0) {
          const ref_MDb = await MAuthor.save();
          return ref_MDb;
          //save the refrence to the file
        } else {
          console.log("author already present", ref_MDAuthors);
          return ref_MDAuthors[0];
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
}); // this is a dummy schema

//dummy data
let books = [
  { name: "Name of the Wind", genre: "Fantasy", id: "1", authorid: "1" },
  { name: "The Final Empire", genre: "Fantasy", id: "2", authorid: "2" },
  { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorid: "3" },
];
let authors = [
  { name: "Patrick Rothfuss", age: 44, id: "1", booksid: "1" },
  { name: "Brandon Sanderson", age: 42, id: "2", booksid: "2" },
  { name: "Terry Pratchett", age: 66, id: "3", booksid: "3" },
];
