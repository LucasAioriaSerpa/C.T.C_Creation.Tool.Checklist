
class ReFormatJSON:
    def __init__(self, json_data:dict[str, str]):
        self.json_data = json_data
    def reformat(self, name_data:str):
        print(f"\n  > dict / json: {name_data}")
        for key, item in self.json_data.items():
            print(f"    |>   Key: {key}")
            print(f"        |>  item: {item}\n")
        return
