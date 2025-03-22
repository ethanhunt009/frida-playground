import frida
import sys


def on_message(message, data):
    if message['type'] == 'send':
        print(f"[+] Message : {message['payload']}")
    elif message['type'] == 'error':
        print(f"[+] Error: {message['stack']}")

js_code = """
// Enumerate all exports from ntdll.dll
var syscalls = Module.enumerateExports("ntdll.dll").filter(function(exp) {
    // Filter exported functions starting with "Nt"
    return exp.name.startsWith("Nt");
});

// Hook each syscall dynamically
syscalls.forEach(function(syscall) {
    Interceptor.attach(ptr(syscall.address), {
        onEnter: function (args) {
            console.log(`${syscall.name} called`);
            // Log the first argument as an example (signature may vary per syscall)
            console.log(`Argument 0: ${args[0]}`);
        },
        onLeave: function (retval) {
            console.log(`${syscall.name} returned with value: ${retval}`);
        }
    });
});

console.log(`[+] Hooked ${syscalls.length} syscalls from ntdll.dll`);

"""

def main(target_process_name):
    try:
        session = frida.attach(target_process_name)
        print(f"[+] Attached to {target_process_name}")
    except frida.ProcessNotFoundError:
        print(f"[+] Could not find process: {target_process_name}")
    script =  session.create_script(js_code)
    script.on('message', on_message)
    print(f"[+] Script created. Lodaing...")
    script.load()
    print("[*] Script loaded. Press Ctrl+C to quit.")
    try:
        sys.stdin.read()
    except KeyboardInterrupt:
        print("[+] Detaching...")
        session.detach()

if __name__=='__main__':
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <process_name>")
        sys.exit(1)
    main(sys.argv[1])