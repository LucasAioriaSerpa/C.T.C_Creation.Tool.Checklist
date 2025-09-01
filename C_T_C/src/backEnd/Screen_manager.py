
# * IMPORTS - modules
...

# * IMPORTS - libraries
...

def check_screen_size(size_screen:tuple [int, int]) -> tuple[int, int]:
    if size_screen[0] < 1 or size_screen[1] < 1:
        raise ValueError("Screen dimensions must be positive integers.")
    if not isinstance(size_screen, tuple) or len(size_screen) != 2:
        raise TypeError("size_screen must be a tuple of two integers.")
    if not all(isinstance(dim, int) for dim in size_screen):
        raise TypeError("Both dimensions in size_screen must be integers.")
    return size_screen

class ScreenManager:
    """
    size_screen: tuple[ x:int, y:int ]
    """
    def __init__(self, size_screen:tuple[int, int]):
        self.size_screen = check_screen_size(size_screen)
        self.screens_options = {
            "Main_menu": "MainMenuScreen",
            "Settings": "SettingsScreen",
            "Creation": "CreationScreen"
        }
        self.screen_choice = None
        print("ScreenManager initialized.")
    def choose_screen(self, screen_name:str):
        self.screen_choice = screen_name
        print(f"Screen chosen: {screen_name}")
    def execute_screen(self):
        if self.screen_choice in self.screens_options:
            print(f"Executing {self.screens_options[self.screen_choice]}...")
