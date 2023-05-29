import { db } from "../firebase";
import Post from "./Post";

export default class User {
  private static path = "users";

  public id?: string;
  public name: string;
  public email: string;
  public password?: string;
  public posts?: Post[];

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  public static collection = db.collection(this.path);

  public static async create(user: User) {
    try {
      const ref = await db.collection(this.path).add(user);

      return ref;
    } catch (e) {
      throw e;
    }
  }

  public static async find() {
    try {
      const result: User[] = [];
      const snapShot = await db.collection(this.path).select("name").get();

      snapShot.forEach((doc) => {
        result.push({ id: doc.id, ...(doc.data() as User) });
      });

      return result;
    } catch (e) {
      console.log(e);
    }
  }

  public static async findById(id: string, options: { relations: boolean } = { relations: true }) {
    try {
      const result = await db.collection(this.path).doc(id).get();

      if (options?.relations) {
        const postSnapshot = await Post.collection.where("author", "==", id).get();
        const posts: Post[] = [];
        postSnapshot.forEach((doc) => posts.push({ id: doc.id, ...(doc.data() as Post) }));

        return { ...result.data(), posts } as User;
      }

      return result.data();
    } catch (e) {
      console.log(e);
    }
  }
}
