console.log("[+] Monitoring all syscalls via libc.so");

// exporting all functions from libc.so
var syscalls = Module.enumerateExports("libc.so.6").filter(function (exp) {
    return exp.name.startsWith("syscall") || exp.name.startsWith("__libc_");
});

console.log(`[+] Found ${syscalls.length} syscalls exported by libc.so`);

// hooking all syscall dynamically
syscalls.forEach(function (syscall) {
    try {
        Interceptor.attach(ptr(syscall.address), {
            onEnter: function (args) {
                console.log(`[+] ${syscall.name} called`);
                for (var i = 0; i < args.length; i++) {
                    console.log(`    Arg[${i}]: ${args[i]}`);
                }
            },
            onLeave: function (retval) {
                console.log(`[+] ${syscall.name} returned: ${retval}`);
            }
        });
    } catch (err) {
        console.log(`[!] Failed to hook ${syscall.name}: ${err.message}`);
    }
});

console.log("[+] Hooking complete. Monitoring syscalls...");
