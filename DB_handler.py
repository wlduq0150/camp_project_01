import json
import logging
from pyrebase import initialize_app

class DBModule:
    def __init__(self):
        with open("auth/firebase.json") as f:
            config = json.load(f)

        self.firebase = initialize_app(config)
        self.db = self.firebase.database()
        self.logger = logging.getLogger(__name__)

    def close(self):
        # Close the Firebase connection if needed
        # self.firebase.delete()
        pass

    def get_profile(self, name):
        try:
            profile_data = self.db.child("profiles").child(name).get()
            if profile_data.val():
                return profile_data.val()
            else:
                return {"mbti": "Not found", "blog": "Not found", "motto": "Not found"}
        except pyrebase_exceptions.HTTPError as e:
            return f"HTTPError: {e}"
        except pyrebase_exceptions.PyrebaseError as e:
            return f"PyrebaseError: {e}"
        except Exception as e:
            return str(e)
