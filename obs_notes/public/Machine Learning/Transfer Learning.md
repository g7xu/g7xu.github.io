**Summary**: Reuse a network pretrained on a large dataset (e.g. ImageNet) for a new task with less data. Because neural-network features are hierarchical and generic at lower layers, you can keep most of them and only retrain the parts that need to specialize — how much you retrain scales with how much data you have.

**Last updated**: 2026-05-29

---

A practical reason [[Neural Network|neural networks]] (especially [[Convolutional Neural Network (CNN)|CNNs]]) are so useful: their learned features **transfer**. The hierarchical, expressive features learned for one task can be **reused** for a new task — so you don't need the huge labeled dataset again; a small amount of data can re-target them.

## The setup
Take a **source model** $H_s$ trained on a large **source dataset** — the classic one is **ImageNet** (≈1M images, 1000 classes), widely used as a pretraining base. Transfer it to a **target model** for your **target task**, which usually has far fewer images and different classes. Use $H_s$ as the **initialization** for the target network.

## How much to retrain — scales with your data budget
Going from least to most data, retrain progressively more of the network:

| Data available | What to retrain | Why |
|---|---|---|
| **Very little** | Only the **final classification layer** | Swap the 1000-way head for your *k*-way head; train just those new connections — few weights, so little data suffices. |
| **A bit more** | Also the **fully-connected layers** | FC layers have the whole-image receptive field, so they hold **task-specific** features (cat-vs-dog). Re-learning them re-targets the task (e.g. → car-vs-bike). |
| **More** | Also the **deeper conv layers** | These (wide receptive field via pooling) capture **parts** — ears, eyes, legs — useful but not fully task-specific. |
| **Lots** | **Fine-tune the whole network** | Initialize all layers from $H_s$, then re-optimize everything. |

Intuition: **convolutional layers extract generic features; fully-connected layers extract task-specific ones.** So with little data you keep the generic conv features and only relearn the task-specific top.

## The learning rate = inertia vs. responsiveness
When fine-tuning, the **learning rate** decides how far you move from the pretrained weights toward the new data:
- **High learning rate** for layers you want to **relearn from scratch** (the new classification layer) — quickly absorb the new task.
- **Low learning rate** for layers you want to **preserve** (intermediate conv layers) — respond to new data a little, but don't forget the good ImageNet features.

It also depends on **source↔target similarity**: similar domains → gentler fine-tuning (fewer layers, smaller learning rate); very different domains + enough data → retrain more, higher learning rate. Choosing the learning rate is itself a hyperparameter search — done on a [[Generalization & Model Validation|validation set]].

## Related pages
- [[Convolutional Neural Network (CNN)]]
- [[Neural Network]]
- [[Generalization & Model Validation]]
- [[Recognition & Vision Tasks]]
