
# * IMPORTS - modules
import C_T_C.src.backEnd.Screen_manager as sm

# * IMPORTS - libraries
import os

class Main():
    def __init__(self):
        print("Main.py is running...")
        screen_manager = sm.ScreenManager((800, 600))
        screen_manager.choose_screen("Main_menu")
        screen_manager.execute_screen()
    def run(self):
        while True:
            print("Main loop running...\n")
            print("Waiting for events...\n")
            input("\n=======[!!! PRESS CTRL+C TO EXIT !!!]=======\nPress Enter to continue...\n     -> ")
            os.system('cls' if os.name == 'nt' else 'clear')
