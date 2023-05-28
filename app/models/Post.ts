import { db } from "../firebase";

export default class Post {
  private static path = "posts";

  public id?: string;
  public title: string;
  public content: string;
  public author: string;
  public coAuthors?: string[];
  public comments?: string[];

  constructor(post: Post) {
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
  }

  public static async create(post: Post) {
    try {
      const ref = await db.collection(this.path).add(post);

      return ref;
    } catch (e) {
      console.log(e);
    }
  }

  public static async find() {
    try {
      const result: Post[] = [];
      const snapShot = await db.collection(this.path).get();

      snapShot.forEach((doc) => {
        result.push({ id: doc.id, ...(doc.data() as Post) });
      });

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
