import { NgModule } from "@angular/core";
import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";

const dbConfig: DBConfig  = {
    name: 'Sprites',
    version: 1,
    objectStoresMeta: [{
      store: 'sprite',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'sprite', keypath: 'sprite', options: { unique: false } },
      ],
    }],
  };
  

@NgModule({
    imports: [
        NgxIndexedDBModule.forRoot(dbConfig),
    ],
})
export class SpritesModule {

}
