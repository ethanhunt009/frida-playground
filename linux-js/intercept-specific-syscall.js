console.log("[+] Intercepting specific Linux syscalls: execve, fork, clone");

// hooking execve 
Interceptor.attach(Module.findExportByName("libc.so.6", "execve"), {
    onEnter: function (args) {
        console.log("[*] execve called");
        console.log("    Path: " + args[0].readUtf8String());
        console.log("    Args: " + args[1].readPointer().readUtf8String());
    },
    onLeave: function (retval) {
        console.log("[*] execve returned: " + retval.toInt32());
    }
});

// hooking fork 
Interceptor.attach(Module.findExportByName("libc.so.6", "fork"), {
    onEnter: function (args) {
        console.log("[*] fork called");
    },
    onLeave: function (retval) {
        console.log("[*] fork returned: PID " + retval.toInt32());
    }
});

// hooking clone 
Interceptor.attach(Module.findExportByName("libc.so.6", "clone"), {
    onEnter: function (args) {
        console.log("[*] clone called");
        console.log("    Flags: " + args[0].toInt32());
    },
    onLeave: function (retval) {
        console.log("[*] clone returned: PID " + retval.toInt32());
    }
});

console.log("[+] Hooking complete. Monitoring specific syscalls...");
