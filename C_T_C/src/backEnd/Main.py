
# * IMPORTS - modules
import C_T_C.src.backEnd.Screen_manager as sm

# * IMPORTS - libraries
...

class main(args=None):
    print("Main.py is running...")
    screen_manager = sm.ScreenManager((800, 600))
    screen_manager.choose_screen("Main_menu")
    screen_manager.execute_screen()
    while True:
        print("Main loop running...\n")
        print("Waiting for events...\n")
        input("\n=======[!!! PRESS CTRL+C TO EXIT !!!]=======\nPress Enter to continue...")
