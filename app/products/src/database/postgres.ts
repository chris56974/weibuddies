import { ProductDatabase } from "./interface"
import { Product } from "./interface"
import { Pool } from "pg"

// Coding to the Database interface instead of an implementation
declare module "pg" {
  interface Pool extends ProductDatabase { }
}

Pool.prototype.getProduct = (email: string): any => { }
Pool.prototype.createProduct = (userId: string): any => { }

export const postgres_db: ProductDatabase = new Pool()