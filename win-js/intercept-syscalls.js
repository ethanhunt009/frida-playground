console.log("[+] Intercepting specific Windows syscalls: NtCreateFile, NtOpenFile, NtCreateProcess");

// hooking NtCreateFile 
Interceptor.attach(Module.findExportByName("ntdll.dll", "NtCreateFile"), {
    onEnter: function (args) {
        console.log("[*] NtCreateFile called");
        console.log("    File handle: " + args[0]);
        console.log("    Desired Access: " + args[1].toInt32());
        console.log("    Object Attributes: " + args[2].readPointer());
    },
    onLeave: function (retval) {
        console.log("[*] NtCreateFile returned: " + retval.toInt32());
    }
});

// hooking NtOpenFile
Interceptor.attach(Module.findExportByName("ntdll.dll", "NtOpenFile"), {
    onEnter: function (args) {
        console.log("[*] NtOpenFile called");
        console.log("    File handle: " + args[0]);
        console.log("    Desired Access: " + args[1].toInt32());
        console.log("    Object Attributes: " + args[2].readPointer());
    },
    onLeave: function (retval) {
        console.log("[*] NtOpenFile returned: " + retval.toInt32());
    }
});

// hooking NtCreateProcess
Interceptor.attach(Module.findExportByName("ntdll.dll", "NtCreateProcess"), {
    onEnter: function (args) {
        console.log("[*] NtCreateProcess called");
        console.log("    Parent Process Handle: " + args[0]);
        console.log("    Desired Access: " + args[1].toInt32());
    },
    onLeave: function (retval) {
        console.log("[*] NtCreateProcess returned: " + retval.toInt32());
    }
});

console.log("[+] Hooking complete. Monitoring syscalls...");
