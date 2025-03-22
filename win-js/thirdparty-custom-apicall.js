console.log("[+] Monitoring API calls from third-party/custom DLLs");

// list of loaded modules
var loadedModules = Process.enumerateModules();
console.log(`[+] Found ${loadedModules.length} loaded modules.`);

// List of excluded dll's
var systemDLLs = [
    "ntdll.dll",
    "kernel32.dll",
    "user32.dll",
    "gdi32.dll",
    "advapi32.dll",
    "ws2_32.dll"
];

// filtering thirdparty or custom dll's
var customModules = loadedModules.filter(function(module) {
    return !systemDLLs.includes(module.name.toLowerCase());
});

console.log(`[+] Found ${customModules.length} third-party/custom DLLs.`);

// Hook all exports from third-party/custom DLLs
customModules.forEach(function(module) {
    console.log(`[+] Hooking module: ${module.name}`);
    Module.enumerateExports(module.name).forEach(function(exp) {
        try {
            Interceptor.attach(ptr(exp.address), {
                onEnter: function (args) {
                    console.log(`[+] API call in ${module.name}: ${exp.name}`);
                    for (var i = 0; i < args.length; i++) {
                        console.log(`    Arg[${i}]: ${args[i]}`);
                    }
                },
                onLeave: function (retval) {
                    console.log(`[+] ${exp.name} returned: ${retval}`);
                }
            });
        } catch (err) {
            console.log(`[!] Failed to hook ${exp.name} in ${module.name}: ${err.message}`);
        }
    });
});

console.log("[+] Hooking complete. Monitoring API calls...");
