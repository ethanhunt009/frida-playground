import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        print(f"[+] Message : {message['payload']}")
    elif message['type'] == 'error':
        print(f"[+] Error bitch...")


def main(target_process_name, js_file_path):
    try:
        with open(js_file_path, 'r') as f:
            js_code = f.read()
    except FileNotFoundError:
        print(f"[!] File not found bitch, give a valid file path!")
    
    
    try:
        session = frida.attach(target_process_name)
        print(f"[+] Attached to {target_process_name}")
    except frida.ProcessNotFoundError:
        print(f"[!] Not again bitch, give valid process name or pid")
        sys.exit(1)
    
    script = session.create_script(js_code)
    script.on('message', on_message)
    print("[+] Script created. Loading...")
    script.load()
    script.load()
    print("[+] Script loaded. Press Ctr+c to quit.")
    
    try:
        sys.stdin.read()
    except KeyboardInterrupt:
        print("[*] Detaching .. ..")
        session.detach()
    
if __name__ == "__main__":
    if len(sys.argv) == 3:
        print(f"Usage: {sys.argv[0]}  <process nem> <js-file-path>")
        sys.exit(1)
    target_process_name = sys.argv[1]
    js_file_path = sys.argv[2]
    main(target_process_name, js_file_path)
    