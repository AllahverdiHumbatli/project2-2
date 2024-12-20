
import {SETTINGS} from './settings'
import {initApp} from "./app";
import {runDb} from "./common/db/mongoose/mongooseDb";


export const startApp = async () => {
    const app = initApp()
    app.set('trust proxy', true);
    // await db.run(SETTINGS.MONGO_URL)
    await runDb()
    console.log(SETTINGS.BLOG_COLLECTION_NAME)
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })

}
startApp()


//dsf