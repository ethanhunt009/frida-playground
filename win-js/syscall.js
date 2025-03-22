console.log("[+] Intercepting specific syscalls: execve, fork, clone");

// hooking execve
Interceptor.attach(Module.findExportByName(null, "execve"), {
    onEnter: function (args) {
        console.log("[*] execve called");
        console.log("    Path: " + args[0].readUtf8String()); // Path to the executable
        console.log("    Args: " + args[1].readPointer().readUtf8String()); // First argument (e.g., "/bin/bash")
    },
    onLeave: function (retval) {
        console.log("[*] execve returned: " + retval.toInt32());
    }
});

// hooking fork 
Interceptor.attach(Module.findExportByName(null, "fork"), {
    onEnter: function (args) {
        console.log("[*] fork called");
    },
    onLeave: function (retval) {
        console.log("[*] fork returned: PID " + retval.toInt32());
    }
});

// hooking clone 
Interceptor.attach(Module.findExportByName(null, "clone"), {
    onEnter: function (args) {
        console.log("[*] clone called");
        console.log("    Flags: " + args[0].toInt32()); // Clone flags
    },
    onLeave: function (retval) {
        console.log("[*] clone returned: PID " + retval.toInt32());
    }
});

console.log("[+] Hooking complete. Monitoring syscalls...");
