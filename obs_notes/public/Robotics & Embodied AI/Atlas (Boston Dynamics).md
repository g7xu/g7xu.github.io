**Summary**: Atlas is Boston Dynamics' humanoid robot. After a decade as a hydraulic research platform (parkour, backflips), it was reset in April 2024 as an **all-electric** machine and, at **CES 2026**, unveiled as a **production** industrial humanoid — 56 DoF, dexterous tactile hands, 360° vision with millimeter-accurate 2D+3D perception, lifts 50 kg. It is **already in production** at Boston Dynamics' Boston HQ, with the entire 2026 supply committed to **Hyundai Motor Group** and **Google DeepMind** — the latter supplying foundation models for the robot's "brain."

**Sources**: Boston Dynamics, *"Boston Dynamics Unveils New Atlas Robot to Revolutionize Industry"* (press release, 2026-01-05) · Boston Dynamics, *"Atlas' Evolution From Research Robot to Industrial Humanoid"* (blog, 2026-03-17) · TechCrunch, *"Atlas, meet Atlas"* (Kirsten Korosec, 2026-01-05) · Interesting Engineering, *"Atlas robot gets superhuman 3D vision in major Boston Dynamics upgrade"* (Aamir Khollam, 2025-05-28).

**Last updated**: 2026-05-30

---

**Atlas** is Boston Dynamics' humanoid robot — for over a decade the most recognizable figure in robotics, and as of 2026 an **enterprise-ready industrial humanoid**: electric, autonomous, and engineered to work safely alongside people in factories and warehouses.

## Evolution: research robot → industrial humanoid
Boston Dynamics frames Atlas's commercial arrival as the payoff of a long research arc, not a sudden product launch (source: Atlas' Evolution From Research Robot to Industrial Humanoid.md):

- **Research foundations (pre-2024).** Hydraulic Atlas pushed the limits of full-body control, balance, and whole-body motion — parkour, dancing, running, backflips, carrying heavy objects. These "flashy demos" produced the control/perception/manipulation expertise that later designs were built on.
- **2024 — the all-electric reset.** In **April 2024** Boston Dynamics introduced an **all-electric Atlas**, a "decisive reset" that started its commercial journey. Electric actuation brought reduced complexity, quieter operation, and better energy efficiency — but the goal was a humanoid that could be *deployed, maintained, and trusted* in real environments. (It could still do a backflip.)
- **2025 — the first real application.** The team focused on **part sequencing** in automotive manufacturing — a task with real ROI that stresses task diversity, behavior complexity, and environmental complexity. Behaviors were built with **reinforcement learning in simulation** and **teleoperated demonstrations**, plus 2D/3D perception, iterated gripper design, and **large behavior models** for full-body control. Atlas was tested at Hyundai's metaplant in Georgia (filmed by *60 Minutes*).
- **2026 — production.** In **January 2026**, Boston Dynamics and Hyundai unveiled the **production-ready Atlas** at CES. The company is **manufacturing it now** at its Boston HQ.

## Production Atlas — specs
(sources: Boston Dynamics Unveils New Atlas Robot….md, Atlas, meet Atlas.md)

- **56 degrees of freedom**, mostly **fully rotational joints**.
- **Human-scale hands** with **tactile sensing in the fingers and palms** for dexterous manipulation.
- **360° cameras** — sees in all directions, so it knows when people approach.
- **Reach of 2.3 m (7.5 ft)** and the strength to **lift up to 50 kg (110 lb)**.
- **Water-resistant**, rated for real industrial environments — operates at full capability (including strength) from **−20 °C to 40 °C (−4 °F to 104 °F)**.

## How it operates
- **Three control modes**: fully **autonomous**, **teleoperated**, or driven via a **tablet steering interface**.
- **Self-sustaining uptime**: when its battery runs low it **autonomously navigates to a charging station and swaps its own batteries**, then resumes — no need to stop.
- **Industrial integration**: connects to **MES, WMS, and other systems** via Boston Dynamics' **Orbit™** software; integrates with barcode scanners / RFID.
- **Fleet learning** (the key scale principle): once **one** Atlas learns a task, that task can be **replicated across the entire fleet** — and new tasks can be deployed in under a day.
- **Safety**: **human detection** + **fenceless guarding** — sensing *replaces* the physical cage. The 360° cameras let Atlas perceive people approaching and modulate its own behavior (slow / stop / yield) instead of being locked behind a barrier as traditional industrial robots are. The implicit backstop behind any fenceless robot is that its speed/force stay low enough that an unintended contact isn't dangerous. *(The sources state the sensing-and-react features explicitly; Atlas's actual speed/force limits and any safety certification — e.g. ISO 10218 / ISO/TS 15066 — are **not** in these clippings and need verification.)*

## Perception: how Atlas sees (the 2025 vision upgrade)
Boston Dynamics frames **perception, not agility, as the thing that unlocks real-world autonomy** — Atlas has to act in a world of shiny, dark, and tightly-packed parts, so just picking up an item and placing it correctly demands serious visual reasoning (source: Atlas robot gets superhuman 3D vision in major Boston Dynamics upgrade.md). This is the vault's [[Computer Vision Overview|Computer Vision]] theory applied on a moving body. The pipeline has four stages:

1. **2D detection (the groundwork).** Atlas scans its surroundings and assigns **bounding boxes and keypoints** to relevant objects and hazards — classic [[Recognition & Vision Tasks|object detection]] / [[Feature Detection|keypoint detection]]. For **storage fixtures** — factory racks/trays/bins with individual slots that hold parts (like a muffin tin: the tin is the fixture, each cup is a slot) — it splits keypoints into **outer** (the fixture's overall shape: *where is the rack?*) and **inner** (each slot: *which pocket do I reach into?*), so it can localize *individual slots* precisely. Models run in **real time** to keep up with the robot's motion.
2. **3D localization (occlusion & clutter).** To reach into a fixture, Atlas estimates its pose relative to the object: a localization module **aligns observed keypoints with a stored model** and fuses **motion data** over time. Combining inner + outer keypoints gives a robust pose estimate even with **occluded keypoints** or misleading angles, and **spatial memory + context** let it tell apart fixtures that look identical.
3. **Object tracking — "SuperTracker".** Once a part is grasped it must be tracked through space. SuperTracker **fuses kinematic, visual, and force data**, so Atlas notices if a part slips or leaves view. Pose estimation is trained on **synthetic data** and works by **matching real images against CAD renderings** (cf. [[Feature Matching]] / model-based [[Two-View Reconstruction|pose estimation]]), then filtered by **self-consistency checks and kinematic constraints** to reach **millimeter accuracy**.
4. **Calibrated coordination (sight ↔ body).** Fine manipulation needs Atlas's internal model of its own limbs to align almost perfectly with its camera feed — i.e. precise **hand-eye / camera calibration** ([[From Image Plane to Pixel Coordinates|intrinsics]] + [[Extrinsics]]). The calibration continuously compensates for **wear, temperature change, and manufacturing variance**.

**The forward-looking punchline:** Boston Dynamics says the next step is a **unified foundation model "where seeing and doing aren't separate tasks but part of the same process."** That is precisely the [[RT-2|vision-language-action]] thesis — fold perception and control into one model — which is why the [[#The brain: foundation models + the Google DeepMind partnership|DeepMind partnership]] below is the natural sequel to this perception work. *(Note: this upgrade is from May 2025, during the part-sequencing pilot — it predates the Jan 2026 production unveiling.)*

## The brain: foundation models + the Google DeepMind partnership
The earlier TechCrunch snippet teased an unnamed **"new AI partner"**; the press release names it — **Google DeepMind**. Boston Dynamics is integrating **Google DeepMind foundation models** into Atlas to give it greater cognitive capability, and is training the fleet with **RL and foundation models**.

This is the concrete link between this hardware page and the vault's VLA cluster: **DeepMind is the lab behind [[RT-2]]**, the model that established the [[RT-2|vision-language-action]] paradigm. Atlas is exactly the kind of physical platform a learned VLA policy is meant to control — the hardware on which methods like RT-2 run.

## Partners & scale
- **Hyundai Motor Group** — Boston Dynamics' majority shareholder; 2026 fleets ship to Hyundai's Robotics Metaplant Application Center (RMAC). Hyundai is preparing to deploy **tens of thousands** of robots and is building a robotics factory capable of **30,000 robots/year**, part of a **$26 B** US investment.
- **Google DeepMind** — AI foundation-model partner; also a 2026 deployment site.
- **Hyundai Mobis** — supplies Atlas's **actuators**, designed for compatibility with automotive supply chains.
- Additional customers planned for **early 2027**.

## Where it fits
Atlas is the **hardware / embodied-AI** entry in the emerging Robotics area of this vault — the physical body that learned-control software (foundation models, [[RT-2|VLA policies]]) animates. The Hyundai/DeepMind productization story is a real-world counterpart to the VLA research papers: research → electric reset → pilot → fleet deployment.

## Related pages
- [[RT-2]] — the DeepMind VLA model; foundation-model control is exactly the AI layer Atlas is adopting.
