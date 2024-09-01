import {app} from './app'
import {SETTINGS} from './settings'
import { db} from "./common/db/mongo-db";


const startApp = async () => {
    await db.run(SETTINGS.MONGO_URL)
    console.log(SETTINGS.BLOG_COLLECTION_NAME)

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })

}
startApp()

//dsf