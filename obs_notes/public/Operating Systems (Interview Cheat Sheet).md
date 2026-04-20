> Source: [All You Should Know About Operating Systems in Technical Interviews](https://towardsdatascience.com/all-you-should-know-about-operating-systems-in-technical-interviews-4dcc55210fea/)
## What is an Operating System?
- Interface between users and computer hardware
- Program managing hardware and software resources of the computer
- Structured by the kernel (bridge between application and hardware), which is responsible for managing things such as process, internal memory, file, and network

Most applications stay in **user mode** and they are restricted from accessing hardware and other processes which are freely accessible in the **kernel mode**
![[user_kernel_mode.svg|697]]
## Processes & Threads
### Process vs. Thread
**Process**
- Separate memory space (so one cannot corrupt another process)
- Increasing execution time when switching

**Thread**
- A unit of execution within a process
- Fast switching
- Single point of failure
### Lifecycle
- **New**: Process created
- **Ready**: Ready to go
- **Run**: Running
- **Wait**: Waiting for the required resources to be available
- **Complete**: The execution has been complete
- **Suspended Ready**: The process is ready to run but got moved to Disk due to Full RAM
- **Suspended Block**: The process is waiting for resource but got moved to Disk due to Full RAM. Will move to Susp. Ready when the resources is ready
![[process_lifecycle.svg|697]]
### Process Communications
1. **Pipe**: Output of a process becomes the input of another process
2. **Named pipe**: Similar to pipe but handles process of different origin
3. **Message queueing**: It's like a todo list
4. **Shared memory**: Shared data and see the real-time update all at once
5. **Semaphore**: Premium of shared memory where it used to avoid race condition
6. **Socket**: Client/server, server/server communication
### Thread Synchronization
- **Mutex**: Mutual exclusion, which only allows one thread accesses the shared resources at a time
- **Semaphore**: Larger than 1 and allows multiple threads
- **Event**: Remains thread synchronization by notification
### CPU Schedule Process
1. **First Come First Serve**
2. **Shortest Job First**
3. **Shortest Remaining Time First**
4. **Round Robin**: Each process is allocated to a given time
5. **Priority Based**: Based on Priority Score
6. **Multilevel**: Multiple priority queue
7. **Multilevel Queue Feedback**: Process can change in these multi priority queue
### Potential Bugs
- **Context switching**: Switch from one running process to another process
- **Race Condition**: When different processes or different threads modified share resources causing a problem
## Memory Management
### Memory Model
- **Primary memory (internal)**: CPU registers, cache memory and main memory
- **Secondary memory (external)**: Different types of disk
### OS Memory Allocation
- **Partitioned allocation**: Memory by block
- **Paged memory management**: Memory by page frames (not continuous)
- **Segmented memory management**: Divide memory by segments
- **Segmentation with paging**: Divide things in logic chunks, then separates each segment into several page frames