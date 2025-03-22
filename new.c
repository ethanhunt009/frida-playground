#include <windows.h>
#include <stdio.h>
#include <winternl.h>

typedef NTSTATUS(NTAPI* NtWriteFile_t)(
    HANDLE FileHandle,
    HANDLE Event,
    PVOID ApcRoutine,
    PVOID ApcContext,
    PIO_STATUS_BLOCK IoStatusBlock,
    PVOID Buffer,
    ULONG Length,
    PLARGE_INTEGER ByteOffset,
    PULONG Key
);

int main() {
    HANDLE hFile;
    char buffer[] = "Hello, Syscall!\n";
    IO_STATUS_BLOCK ioStatus;
    NtWriteFile_t NtWriteFile;

    // Load NTDLL
    HMODULE hNtdll = LoadLibraryA("ntdll.dll");
    if (!hNtdll) {
        printf("Failed to load ntdll.dll\n");
        return 1;
    }

    // Get function address
    NtWriteFile = (NtWriteFile_t)GetProcAddress(hNtdll, "NtWriteFile");
    if (!NtWriteFile) {
        printf("Failed to get NtWriteFile address\n");
        return 1;
    }

    // Open a file for writing
    hFile = CreateFileA("syscall_output.txt", GENERIC_WRITE, FILE_SHARE_WRITE, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        printf("Failed to create file\n");
        return 1;
    }

    printf("Process is running. Attach Frida now...\n");

    // Keep the process alive and make syscalls periodically
    while (1) {
        NTSTATUS status = NtWriteFile(hFile, NULL, NULL, NULL, &ioStatus, buffer, sizeof(buffer) - 1, NULL, NULL);
        
        if (status >= 0) {
            printf("Syscall succeeded, wrote to file.\n");
        } else {
            printf("Syscall failed with status: 0x%X\n", status);
        }

        Sleep(3000);  // Sleep for 3 seconds before next syscall (adjust as needed)
    }

    // Cleanup (won't be reached, but good practice)
    CloseHandle(hFile);
    FreeLibrary(hNtdll);

    return 0;
}
