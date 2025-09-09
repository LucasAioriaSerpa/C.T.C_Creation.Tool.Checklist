
#* IMPORTS CUSTOM
import reFormatJSON as RFJSON

#* IMPORTS LIBRARIES
import time

class Main:
    def __init__(self):pass
    def test_reFormatJSON(self):
        print("\nTEST - RFJSON\n")
        obj_reFormatJSON = RFJSON.ReFormatJSON({
            "message": "test-message",
            "author": "lucas",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
            "status": "OK"
        }).reformat("data")
        print(obj_reFormatJSON)
    def run(self):
        print("CTC Backend is running!")

if __name__ == "__main__":Main().run()
