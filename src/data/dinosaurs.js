// 20-dinosaur dataset. Add a 21st by appending an entry here, dropping the
// illustration into /illustrations/<slug>.svg, and a coloring page into
// /downloads/<slug>-coloring.pdf. Nothing else changes.

window.DINOSAURS = [
  {
    slug: "tyrannosaurus-rex",
    name: "Tyrannosaurus rex",
    pronunciation: "tie-RAN-uh-SOR-us REX",
    teaser: "The one everyone draws first.",
    era: "Cretaceous",
    yearsAgo: "68 to 66 million years ago",
    kidTime: "About 66 million years ago, right before all the big dinosaurs disappeared.",
    diet: "Carnivore",
    habitat: "Forested river plains of western North America",
    sizeBucket: "huge",
    lengthM: 12,
    sizeCompare: "about as long as a school bus, and as tall as a giraffe",
    forKids: "T. rex had teeth the size of bananas and a bite strong enough to crunch through bone. Its arms were so short it couldn't clap. Babies had a soft fluff of feathers, like fuzzy chicks the size of a turkey.",
    forParents: "Recent biomechanical modeling suggests adult T. rex topped out around 12 mph, well below the 25+ mph of older popular-science estimates; bone stress at higher speeds would have been catastrophic. Skin impressions confirm scales on the flanks and tail, but close relatives preserve filamentous protofeathers, so a downy juvenile is now the consensus reconstruction. The famous tiny arms were not vestigial; they could lift roughly 200 kg.",
    trivia: [
      "Sue, the most complete T. rex skeleton, lived to about 28 and shows healed injuries that imply other rexes attacked her.",
      "Its binocular vision was sharper than a hawk's.",
      "Recent papers suggest it had lips that covered its teeth at rest."
    ]
  },
  {
    slug: "triceratops",
    name: "Triceratops",
    pronunciation: "try-SAIR-uh-tops",
    teaser: "Three horns, one giant frill, no patience.",
    era: "Cretaceous",
    yearsAgo: "68 to 66 million years ago",
    kidTime: "Lived at the same time as T. rex, and probably fought a few.",
    diet: "Herbivore",
    habitat: "Open woodlands of western North America",
    sizeBucket: "large",
    lengthM: 9,
    sizeCompare: "about the length of two cars parked end to end",
    forKids: "A Triceratops skull could be over two meters long, almost as tall as a grown-up. Its frill might have flushed bright colors when it was excited or angry, like a mood ring made of bone.",
    forParents: "There is an ongoing debate over whether Torosaurus is a mature growth stage of Triceratops rather than a separate genus; the skull-frill morphology shifts dramatically with age. Wear patterns on the beak suggest a diet of tough, fibrous palms and cycads. Healed bite marks from T. rex appear on multiple specimens.",
    trivia: [
      "The frill is riddled with blood vessels, hinting at thermoregulation or display rather than armor.",
      "Hatchlings were the size of a housecat.",
      "Its teeth grew in continuously, like a shark's."
    ]
  },
  {
    slug: "stegosaurus",
    name: "Stegosaurus",
    pronunciation: "STEG-uh-SOR-us",
    teaser: "Plates on top, spikes on the back.",
    era: "Jurassic",
    yearsAgo: "155 to 145 million years ago",
    kidTime: "Lived a very long time ago, way before T. rex was born.",
    diet: "Herbivore",
    habitat: "Floodplains of what is now Colorado and Wyoming",
    sizeBucket: "large",
    lengthM: 9,
    sizeCompare: "about the length of a small camper van",
    forKids: "Stegosaurus had a brain the size of a lime. Its tail spikes have a real name given by paleontologists who liked dad jokes: the thagomizer.",
    forParents: "The plates are not solid armor; they are highly vascularized and most likely served display and thermoregulation roles, possibly flushing with color. The thagomizer term entered scientific use after a 1982 Far Side cartoon. Allosaurus tail vertebrae have been found with puncture wounds matching Stegosaurus spike geometry.",
    trivia: [
      "Plates were arranged in two staggered rows, not pairs.",
      "Could not lift its head much above shoulder height.",
      "Walked on column-like back legs and shorter, bent front legs, giving it a sloped profile."
    ]
  },
  {
    slug: "brachiosaurus",
    name: "Brachiosaurus",
    pronunciation: "BRACK-ee-uh-SOR-us",
    teaser: "Built like a four-story crane.",
    era: "Jurassic",
    yearsAgo: "154 to 150 million years ago",
    kidTime: "Lived a very long time ago, when North America had giant ferns instead of grass.",
    diet: "Herbivore",
    habitat: "Open conifer forests of western North America",
    sizeBucket: "huge",
    lengthM: 22,
    sizeCompare: "as long as a tennis court and as tall as a four-story building",
    forKids: "Brachiosaurus had front legs longer than its back legs, like a giraffe. It probably ate around 200 kilograms of leaves every single day. That is roughly 1,000 heads of lettuce.",
    forParents: "Unlike most sauropods, Brachiosaurus held its neck more vertically, though biomechanical studies suggest blood pressure to the brain remained a problem requiring complex circulatory adaptations. It laid eggs roughly the size of a soccer ball; juveniles grew through about 60 years to reach adult mass. Recent isotope work places it browsing primarily at heights above 9 meters, niche-partitioning from Diplodocus.",
    trivia: [
      "Nostrils sat on top of the skull, in front of the eyes.",
      "Its heart may have weighed over 200 kg.",
      "The genus is named for the unusually long forelimbs, not the neck."
    ]
  },
  {
    slug: "velociraptor",
    name: "Velociraptor",
    pronunciation: "vuh-LOSS-ih-RAP-tor",
    teaser: "Turkey-sized, fully feathered, very fast.",
    era: "Cretaceous",
    yearsAgo: "75 to 71 million years ago",
    kidTime: "Lived a long time ago in the deserts of what is now Mongolia.",
    diet: "Carnivore",
    habitat: "Sand dunes and oases of central Asia",
    sizeBucket: "small",
    lengthM: 2,
    sizeCompare: "about the size of a medium dog with a long tail",
    forKids: "Real Velociraptors were the size of a turkey and covered in feathers. They had one big curved claw on each foot for pinning prey, like a hawk.",
    forParents: "The movie versions are scaled-up Deinonychus, an unrelated North American dromaeosaur. Quill knobs preserved on the ulna of one specimen confirm pennaceous wing-feathers, though Velociraptor was flightless. The famous Fighting Dinosaurs fossil, locked mid-combat with a Protoceratops, was likely buried by a collapsing dune.",
    trivia: [
      "Probably hunted alone or in loose pairs, not coordinated packs.",
      "The killing claw was likely used to pin small prey while it was eaten alive.",
      "Skull was long and shallow, more like a coyote than a movie monster."
    ]
  },
  {
    slug: "spinosaurus",
    name: "Spinosaurus",
    pronunciation: "SPINE-uh-SOR-us",
    teaser: "Sail on its back, paddle for a tail.",
    era: "Cretaceous",
    yearsAgo: "99 to 93 million years ago",
    kidTime: "Lived in giant rivers in what is now Africa, swimming after fish.",
    diet: "Carnivore",
    habitat: "River systems of North Africa",
    sizeBucket: "huge",
    lengthM: 15,
    sizeCompare: "longer than a city bus, with a sail taller than an adult",
    forKids: "Spinosaurus is the only dinosaur we know of that mostly lived in water. It had a long crocodile-shaped snout for catching fish and a flat tail like a paddle.",
    forParents: "A 2020 paper on a Moroccan tail described an eel-like, flexible tail morphology that re-cast Spinosaurus as a pursuit-swimmer rather than a wading shore-dweller, though the extent of its aquatic habits remains contested. Bone density is unusually high, consistent with diving. The original Egyptian holotype was destroyed in a WWII Allied bombing raid in 1944.",
    trivia: [
      "Larger than T. rex by length, though probably lighter.",
      "Conical teeth designed to grip slippery prey, not slice.",
      "The sail may have been a display structure or a thermoregulator."
    ]
  },
  {
    slug: "ankylosaurus",
    name: "Ankylosaurus",
    pronunciation: "ang-KIE-loh-SOR-us",
    teaser: "Living tank with a club for a tail.",
    era: "Cretaceous",
    yearsAgo: "68 to 66 million years ago",
    kidTime: "Lived right alongside T. rex and Triceratops.",
    diet: "Herbivore",
    habitat: "Coastal forests of western North America",
    sizeBucket: "large",
    lengthM: 8,
    sizeCompare: "about the length of a pickup truck with trailer",
    forKids: "Ankylosaurus was covered head to toe in armor plates, even on its eyelids. The club at the end of its tail could swing hard enough to break a T. rex's leg bone.",
    forParents: "Finite element analysis of the tail club suggests impact forces sufficient to fracture the metatarsals of large theropods. The osteoderms are not solid bone; they have a complex internal fiber structure that absorbs and redistributes impact, similar to modern composite armor. It walked on all fours with a slow, deliberate gait.",
    trivia: [
      "Belly was the only unarmored area, the obvious target.",
      "Recent CT scans show a complex, twisty nasal passage, possibly used to cool blood or resonate calls.",
      "Babies were born without their tail clubs; the bones fused with age."
    ]
  },
  {
    slug: "parasaurolophus",
    name: "Parasaurolophus",
    pronunciation: "pair-uh-saw-ROL-oh-fus",
    teaser: "A trombone with legs.",
    era: "Cretaceous",
    yearsAgo: "76 to 73 million years ago",
    kidTime: "Lived a long time ago in big herds, calling to each other through the trees.",
    diet: "Herbivore",
    habitat: "Riverine forests of western North America",
    sizeBucket: "large",
    lengthM: 10,
    sizeCompare: "about the length of two minivans nose to tail",
    forKids: "The long curved tube on its head was hollow, like a trumpet. It could honk loud enough to be heard from a mile away.",
    forParents: "Computer models of the resonating chambers produce a low-frequency call around 30 Hz, well below most modern bird calls and audible across long distances. Crests differ in size between sexes and age groups. Thousands of dental batteries enabled efficient chewing of tough conifer needles.",
    trivia: [
      "Could rear up on two legs to run, drop to four to graze.",
      "Three known species, each with a slightly different crest curve.",
      "Babies had stubby crests that grew dramatically through adolescence."
    ]
  },
  {
    slug: "therizinosaurus",
    name: "Therizinosaurus",
    pronunciation: "THER-uh-ZINE-oh-SOR-us",
    teaser: "Giant feathered claws, salad eater.",
    era: "Cretaceous",
    yearsAgo: "70 million years ago",
    kidTime: "Lived a long time ago in dry forests of what is now Mongolia.",
    diet: "Herbivore",
    habitat: "Dry forests of central Asia",
    sizeBucket: "large",
    lengthM: 10,
    sizeCompare: "as tall as a giraffe with claws longer than your arm",
    forKids: "Therizinosaurus had the longest claws of any animal that ever lived, almost a meter each. It used them to pull leafy branches down to its mouth, like garden shears.",
    forParents: "Despite a theropod ancestry, the body plan converged on a sloth-like browser with a wide gut for fermenting plant material. The claws were almost certainly for foraging, with possible secondary use in display or defense. It is among the largest known feathered animals.",
    trivia: [
      "Originally classified as a giant sea turtle when first found.",
      "Feet had four forward-facing toes, unusual for theropods.",
      "Probably stood upright like a kangaroo to reach high branches."
    ]
  },
  {
    slug: "microraptor",
    name: "Microraptor",
    pronunciation: "MY-kroh-RAP-tor",
    teaser: "Four wings. Iridescent black. The size of a crow.",
    era: "Cretaceous",
    yearsAgo: "120 million years ago",
    kidTime: "Lived a long time ago in forests of what is now China.",
    diet: "Carnivore",
    habitat: "Forested wetlands of east Asia",
    sizeBucket: "tiny",
    lengthM: 0.8,
    sizeCompare: "about the size of a crow",
    forKids: "Microraptor had wings on both its arms and its legs, four wings in total. It probably glided between trees like a flying squirrel.",
    forParents: "Melanosome analysis revealed an iridescent black plumage similar to a modern starling, the first dinosaur for which color has been determined with reasonable confidence. Stomach contents include mammals, birds, lizards, and fish, suggesting a generalist predator. Whether it could power-flap or only glide remains an active debate.",
    trivia: [
      "One of the smallest known non-avian dinosaurs.",
      "Discovered in 2000; over 300 specimens known.",
      "Ankle joints suggest it could perch in trees."
    ]
  },
  {
    slug: "diplodocus",
    name: "Diplodocus",
    pronunciation: "dih-PLOD-uh-kus",
    teaser: "All neck and tail, very little middle.",
    era: "Jurassic",
    yearsAgo: "154 to 150 million years ago",
    kidTime: "Lived a very long time ago in dry plains with rivers running through.",
    diet: "Herbivore",
    habitat: "Open plains of western North America",
    sizeBucket: "huge",
    lengthM: 26,
    sizeCompare: "longer than three school buses end to end",
    forKids: "Diplodocus had a tail like a whip that could crack the air faster than the speed of sound. Its long neck held its head out flat, low to the ground, perfect for grazing.",
    forParents: "Computer simulations of the tail in 1997 suggested supersonic crack speeds, though tissue damage from such cracks would have been a real cost. Peg-like teeth at the front of the mouth, used for stripping leaves rather than chewing. Vertebrae are deeply hollowed, an air-sac-driven weight-saving system shared with modern birds.",
    trivia: [
      "Held its neck horizontally, not raised like Brachiosaurus.",
      "Hatchlings grew about a meter per year.",
      "The skeleton casts gifted to museums by Andrew Carnegie are the basis for many public exhibitions worldwide."
    ]
  },
  {
    slug: "allosaurus",
    name: "Allosaurus",
    pronunciation: "AL-uh-SOR-us",
    teaser: "The Jurassic's main predator.",
    era: "Jurassic",
    yearsAgo: "155 to 145 million years ago",
    kidTime: "Lived in the same time and place as Stegosaurus, often hunting it.",
    diet: "Carnivore",
    habitat: "Floodplain forests of western North America",
    sizeBucket: "large",
    lengthM: 9,
    sizeCompare: "about the length of a delivery truck",
    forKids: "Allosaurus had a mouth that could open extra wide, almost 90 degrees, like a snake. It used its head like a hatchet, swinging it down at prey.",
    forParents: "Unlike T. rex, which delivered crushing bite force, Allosaurus had a relatively weak bite but a hatchet-style attack: it used neck musculature to drive serrated upper teeth down through flesh. Multiple specimens at the Cleveland-Lloyd quarry suggest predator traps where carcasses attracted further predators. Distinct ridges above the eyes; juvenile and adult skulls differ markedly.",
    trivia: [
      "Most common large theropod in the Morrison Formation.",
      "Some specimens show healed Stegosaurus thagomizer wounds.",
      "Three forward-curving claws on each hand."
    ]
  },
  {
    slug: "iguanodon",
    name: "Iguanodon",
    pronunciation: "ig-WAH-no-don",
    teaser: "A thumb spike for trouble.",
    era: "Cretaceous",
    yearsAgo: "126 to 122 million years ago",
    kidTime: "Lived a long time ago in forests across Europe.",
    diet: "Herbivore",
    habitat: "Mixed forests and floodplains of Europe",
    sizeBucket: "large",
    lengthM: 10,
    sizeCompare: "about the length of two cars parked end to end",
    forKids: "Iguanodon had a sharp pointy thumb instead of a claw. Scientists first thought the spike went on its nose, like a horn.",
    forParents: "The second non-avian dinosaur ever named, in 1825. Early reconstructions placed the thumb spike on the snout; the correct anatomy was sorted out after the 1878 Bernissart bonebed in Belgium yielded dozens of complete skeletons. Could walk on all fours when grazing and rear up on two when running or browsing.",
    trivia: [
      "The fifth digit was prehensile, useful for grasping plants.",
      "Cheek teeth were similar to a modern iguana's, hence the name.",
      "Bernissart specimens were found 322 meters underground in a coal mine."
    ]
  },
  {
    slug: "pachycephalosaurus",
    name: "Pachycephalosaurus",
    pronunciation: "PACK-ee-SEF-uh-loh-SOR-us",
    teaser: "Skull like a bowling ball.",
    era: "Cretaceous",
    yearsAgo: "70 to 66 million years ago",
    kidTime: "Lived right at the end of the dinosaur age, in forests of what is now Montana.",
    diet: "Omnivore",
    habitat: "Upland forests of western North America",
    sizeBucket: "medium",
    lengthM: 4.5,
    sizeCompare: "about the length of a small car",
    forKids: "Its skull was 25 centimeters of solid bone, thicker than a brick wall. It probably bashed sides with rivals, like a bighorn sheep.",
    forParents: "The head-butting hypothesis is partially supported by recent histology showing healed skull lesions consistent with intraspecific combat, though biomechanical analyses argue against high-speed direct ramming. The dome thickens with age and is sexually dimorphic. Diet is debated; sharp anterior teeth and leaf-shaped cheek teeth suggest omnivory.",
    trivia: [
      "Some bumpy nubs around the dome may have been horn-like display structures.",
      "Stygimoloch and Dracorex are now thought to be juvenile growth stages.",
      "Despite the impressive skull, the brain was small and tucked low."
    ]
  },
  {
    slug: "carnotaurus",
    name: "Carnotaurus",
    pronunciation: "CAR-no-TOR-us",
    teaser: "Bull-horned, fast, and tiny-armed.",
    era: "Cretaceous",
    yearsAgo: "72 to 69 million years ago",
    kidTime: "Lived a long time ago in what is now Argentina.",
    diet: "Carnivore",
    habitat: "Arid plains of South America",
    sizeBucket: "large",
    lengthM: 8,
    sizeCompare: "about the length of a delivery truck",
    forKids: "Carnotaurus had two short horns above its eyes, like a bull. Its arms were even shorter and stranger than T. rex's, like little flippers.",
    forParents: "Skin impressions from the holotype show a mosaic of pebbly scales studded with larger osteoderms running in rows along the body. Tail muscle attachments suggest one of the fastest large theropods, possibly clearing 30 mph for short bursts. Skull is short and deep, optimized for slashing rather than crushing bites.",
    trivia: [
      "The forearms were so reduced that the radius and ulna were nearly fused.",
      "Likely hunted small to mid-size sauropods.",
      "Eyes faced more forward than most theropods, suggesting some binocular vision."
    ]
  },
  {
    slug: "plateosaurus",
    name: "Plateosaurus",
    pronunciation: "PLAT-ee-uh-SOR-us",
    teaser: "An early giant, before the giants.",
    era: "Triassic",
    yearsAgo: "214 to 204 million years ago",
    kidTime: "Lived in the time before there were really big dinosaurs.",
    diet: "Herbivore",
    habitat: "Seasonal floodplains of what is now Europe",
    sizeBucket: "large",
    lengthM: 8,
    sizeCompare: "about the length of a delivery truck",
    forKids: "Plateosaurus is one of the oldest big dinosaurs we have good fossils of. It walked on two legs and used its hands to pull down branches.",
    forParents: "Among the earliest dinosaurs to evolve large body size; an evolutionary stepping-stone toward sauropods. Bone histology shows individuals reached final size at very different ages, which is unusual and may reflect resource-driven growth flexibility. Mass-mortality bonebeds suggest seasonal die-offs near drying water sources.",
    trivia: [
      "Hands had a large thumb claw, possibly defensive.",
      "Could not pronate its hands, so it walked bipedally.",
      "Discovered in Germany in 1834, one of the first dinosaurs ever named."
    ]
  },
  {
    slug: "coelophysis",
    name: "Coelophysis",
    pronunciation: "see-LOW-fie-sis",
    teaser: "Slim, fast, hollow-boned.",
    era: "Triassic",
    yearsAgo: "215 to 208 million years ago",
    kidTime: "Lived in the very early dinosaur days, in the dry warm part of the world.",
    diet: "Carnivore",
    habitat: "Arid floodplains of what is now New Mexico",
    sizeBucket: "small",
    lengthM: 3,
    sizeCompare: "about the length of a sofa",
    forKids: "Coelophysis was small, fast, and probably hunted in groups. Its bones were hollow inside, like a bird's, which made it light enough to sprint.",
    forParents: "The Ghost Ranch quarry preserves hundreds of articulated specimens, suggesting either a flash flood event or a herd or social grouping. Earlier claims of cannibalism based on small bones inside adult ribcages have been revisited; the small bones now appear to be crurotarsans rather than juvenile Coelophysis. Among the earliest theropods.",
    trivia: [
      "Took a trip to space aboard the Space Shuttle Endeavour in 1998.",
      "New Mexico's official state fossil.",
      "Two distinct body shapes in the Ghost Ranch material may indicate sexual dimorphism."
    ]
  },
  {
    slug: "eoraptor",
    name: "Eoraptor",
    pronunciation: "EE-oh-RAP-tor",
    teaser: "One of the very first dinosaurs.",
    era: "Triassic",
    yearsAgo: "231 million years ago",
    kidTime: "Lived right at the start of the age of dinosaurs.",
    diet: "Omnivore",
    habitat: "River valleys of what is now Argentina",
    sizeBucket: "tiny",
    lengthM: 1,
    sizeCompare: "about the size of a small dog",
    forKids: "Eoraptor was one of the first dinosaurs ever. It was small, light, and ran on two legs. It probably ate both plants and small animals.",
    forParents: "Position in the dinosaur family tree is debated; once classified as a basal theropod, it is now widely placed as an early sauropodomorph. Heterodont dentition with both leaf-shaped and recurved teeth indicates omnivory. Discovered in 1991 in the Ischigualasto Formation, one of the most productive Triassic sites.",
    trivia: [
      "Existed before the major dinosaur lineages had fully diverged.",
      "Lived alongside non-dinosaur reptiles still dominant in its ecosystem.",
      "Hand had five fingers, with the fourth and fifth already reduced."
    ]
  },
  {
    slug: "deinonychus",
    name: "Deinonychus",
    pronunciation: "die-NON-ih-kus",
    teaser: "The real raptor everyone is thinking of.",
    era: "Cretaceous",
    yearsAgo: "115 to 108 million years ago",
    kidTime: "Lived in forests of what is now Montana, hunting prey bigger than itself.",
    diet: "Carnivore",
    habitat: "Forested wetlands of central North America",
    sizeBucket: "medium",
    lengthM: 3.4,
    sizeCompare: "about as long as a small horse",
    forKids: "Deinonychus is what the movie raptors are based on. It had a giant curved claw on each foot and was probably covered in feathers.",
    forParents: "John Ostrom's 1969 description of Deinonychus reset the field, providing strong support for warm-blooded, active theropods and the bird-dinosaur connection that remains the consensus today. Jurassic Park uses the name Velociraptor for animals scaled and proportioned like Deinonychus. Whether it hunted in true coordinated packs is now disputed, with stable isotope studies suggesting solitary or loose foraging instead.",
    trivia: [
      "Sickle claw was held off the ground while running.",
      "Probably leapt onto prey and pinned it down with its weight, similar to a modern eagle.",
      "Tail was held stiff by interlocking bony rods."
    ]
  },
  {
    slug: "ichthyovenator",
    name: "Ichthyovenator",
    pronunciation: "IK-thee-oh-VEN-ah-tor",
    teaser: "A spinosaur with a split sail.",
    era: "Cretaceous",
    yearsAgo: "125 million years ago",
    kidTime: "Lived in big rivers of what is now Laos, eating fish.",
    diet: "Carnivore",
    habitat: "River systems of southeast Asia",
    sizeBucket: "large",
    lengthM: 8.5,
    sizeCompare: "about the length of a delivery truck",
    forKids: "Ichthyovenator means fish hunter. Its sail had a strange dip in the middle, like two fins instead of one.",
    forParents: "Described in 2012 from a partial skeleton in Laos, it is among the more complete Asian spinosaurids. The two-part sail is anatomically unusual and probably had a display function. Cervical morphology suggests a habitually low-slung neck for fishing, similar to herons.",
    trivia: [
      "First spinosaurid found in Asia.",
      "Vertebral spines suggest the body sail was tall but interrupted.",
      "Likely competed with giant freshwater fish like Lepidotes."
    ]
  }
];
