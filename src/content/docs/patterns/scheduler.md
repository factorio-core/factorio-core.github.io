---
title: "Scheduler"
description: Bucketed tick scheduler for high-performance delayed and recurring tasks.
---

The `fcore/utils/scheduler` module provides a tick-bucketed scheduling engine designed to eliminate CPU frame-time spikes (UPS drops) caused by naive `on_tick` per-frame polling.

---

## 🏛 How It Works: Tick Bucketing

Instead of iterating through thousands of entities every frame, the scheduler groups tasks into discrete tick buckets in `storage._sched`. On each frame, only the bucket for `game.tick` is executed:

```mermaid
flowchart LR
    subgraph StorageSched["storage._sched (Tick Hash Map)"]
        direction TB
        T100["Bucket [Tick 100]\n[ Task A, Task B ]"]
        T120["Bucket [Tick 120]\n[ Task C ]"]
        T180["Bucket [Tick 180]\n[ Task D, Task E ]"]
    end

    subgraph Engine["Factorio on_tick Dispatcher"]
        CurrentTick["game.tick = 100"]
    end

    Engine -->|"O(1) Direct Lookup"| T100
    T100 -->|Execute| Handlers["Registered Handlers in RAM\n(taskA(), taskB())"]
    T100 -.->|Auto Cleanup| Clean["storage._sched[100] = nil"]
```

---

## 🚀 1. Registering Task Handlers

Handlers are registered in module scope by string ID (so they survive save/load without storing functions in `storage`):

```ts
/** @noSelfInFile */
import * as scheduler from "fcore/utils/scheduler";
import type { PlayerIndex } from "factorio:runtime";

interface ScanPayload {
  networkId: number;
  playerIndex: PlayerIndex;
}

scheduler.register_handler<ScanPayload>("recheck_network", (data, tick) => {
  log(`Executing network scan for #${data.networkId} on tick ${tick}`);
});
```

---

## ⏱ 2. One-Shot Delayed Tasks (`after` / `at`)

Schedule tasks to run after a delay or at a specific future tick:

```ts
import * as scheduler from "fcore/utils/scheduler";

// Run in 120 ticks (2 seconds)
const taskId = scheduler.after(120, "recheck_network", {
  networkId: 1,
  playerIndex: player.index,
});

// Run at specific game tick
scheduler.at(game.tick + 300, "recheck_network", {
  networkId: 2,
  playerIndex: player.index,
});
```

---

## 🔄 3. Recurring Interval Tasks (`every` / `stop`)

Schedule periodic background workers and cancel them when no longer needed:

```ts
import * as scheduler from "fcore/utils/scheduler";

// Runs every 60 ticks (1 second)
const recurringId = scheduler.every(60, "recheck_network", {
  networkId: 1,
  playerIndex: player.index,
});

// Cancel task
scheduler.stop(recurringId);
```

