const genres = [
  'Horror/Supernatural',
  'Romance',
  'Fantasy',
  'Drama',
  'Slice of Life',
  'Young Adult',
  'Sci-Fi',
  'Mystery',
  'Super Hero',
  'Western',
  'Comedy',
];

const settings = [
  'an abandoned house',
  'an abandoned Asylum from the 1800s',
  'a Castle in Romania',
  'a Villa in Italy',
  'the Bodega down the street',
  "grandma's house",
  "aunt Karen's house",
  "abuelita's hacienda",
  "abuelita's bakery",
  'The White House',
  'the middle of the woods',
  'a Leaky basement',
  'a year-around Christmas shop',
  'a Church',
  'an old European Monastery',
  'a cemetery',
  'a room full of ladders on Friday the 13th',
  'a carnival',
  'a Morgue',
  'the cinema',
  'the old theater',
  'Times Square',
  'the San Francisco bay bridge',
  'Coney Island',
  'Miami, Florida',
  'Walmart at 3am',
  'the Santa Monica Pier',
  'the subway',
  'the London Underground',
  'Niagara falls during the full moon',
  'Canada',
  'a cruise ship',
  'the alps',
  'the dinner table at Thanksgiving',
  'an old amusement park',
  'a My Chemical Romance Concert',
  'Central Park',
  'an old jail cell',
  'a haunted house',
  'a Halloween Party on all Hallows Eve',
  'the halloween store',
  'an abandoned high school',
  'an abandoned car in the woods',
  'a club during the equinox',
  'a crowded club at 12am',
  'salem, massachusetts',
  'a junkyard',
  'the drive-in',
  'a room full of spiders',
  'a villa in Italy',
  "grandma's wedding",
  "aunt Karen's wedding",
  'The White House',
  'a year-around Christmas shop',
  'the alter',
  'a tropical beach',
  'a beach with white sands',
  'Coney Island',
  'Versailles',
  'a quiet country village in the UK',
  'a vineyard',
  'a beach in California during sunset',
  'a lake house',
  'a lake',
  'a beach side resort',
  'Cape Cod',
  'a meadow full of flowers',
  'a seashell shop',
  'a tea shop',
  'a coffee shop',
  'Starbucks',
  'a Music Festival',
  'a My Chemical Romance concert',
  'a Broadway play',
  'Central Park',
  'a quiet corner at the local pub',
  'trivia night at the Pub',
  'a ski resort',
  'a light house on a cliff by the sea',
  'economy class on a plane',
  'a train car on the night train',
  'the subway at 10pm',
  '10 year high school reunion',
  'a 20 year high school reunion',
  'a 30 year high school reunion',
  'a 40 year high school reunion',
  'a 50 year high school reunion',
  'the produce section at a grocery store',
  'a cottage in the woods',
  'a castle on a hill',
  'a seaside castle',
  'an underwater castle',
  'a Castle in the clouds',
  'a cottage in the clouds',
  'a cottage by the sea',
  "a Dragon's cave",
  'a cursed castle',
  'an enchanted castle',
  'an enchanted forest',
  'the throne room of the monarch',
  'the top room of the tallest tower of a castle',
  'a cottage made of hot dogs',
  'a cottage made of candy',
  'a cottage made of candy m&ms',
  'a castle made of glass',
  "the Prince's ball",
  "the Princess's ball",
  'a castle guarded by a dragon',
  'a castle guarded by a gryphon',
  'a castle guarded by a 4 headed doggo',
  'a cave that is said to contain the greatest treasure',
  'the lost city of atlantis',
  'a candy corn castle',
  'a hospital',
  'an ER',
  'a burn ward',
  'a court room',
  'a police station',
  'a library',
  'a school',
  "a psychiatrist's office",
  "a therapist's office",
  "a child therapist's office",
  "a couple's therapist office",
  "a lawyer's office",
  'a book club meeting',
  'a church potluck',
  'the office',
  'the house',
  'a car stuck in rush hour traffic',
  'the apartment',
  "Judy's Apartment",
  "Darryl's apartment",
  "Bob's apartment",
  'a Castle in Romania',
  'a Villa in Italy',
  'the Bodega down the street',
  'The White House',
  'the middle of the woods',
  'a Leaky basement',
  'a year-around Christmas shop',
  'a cemetery',
  'a carnival',
  'the cinema',
  'the old theater',
  'Times Square',
  'Coney Island',
  'Portland, Oregon',
  'the subway during rush hour',
  'the London Underground',
  'West Virginia',
  'Cleaveland, Ohio',
  'death valley',
  'lake Geneva',
  'Walmart on Black Friday',
  'the dinner table at Thanksgiving',
  'an amusement park',
  'the apple Store',
  'a My Chemical Romance Concert',
  'Central Park',
  'a jail cell',
  "an ex's house",
  'a room with divorce lawyers',
  'the DMV',
  'the airport',
  'the grocery store',
  'a department store',
  'a game show',
  "a distant relative's funeral",
  'the daycare',
  'a parent teacher conference',
  'a work meeting',
  'a job interview',
  'the produce section at a grocery store',
  'daytona beach during spring break',
  "the set of MTV's cribs",
  'the school gym',
  'the school gym during Prom night',
  'the school cafeteria',
  'the hangout by the lake',
  'the volleyball net at the beach',
  'the train tracks',
  'the junkyard',
  'the used car depot',
  'the school festival',
  'the job fair',
  'the homecoming game',
  'the homecoming dance',
  'the spring fling dance',
  'the winter ball',
  "the valentine's day dance",
  'prom night at 3am',
  "the prom afterparty at Chad's house",
  'a bake sale at the school fundraiser',
  'the surface of the sun',
  'the surface of the moon',
  'a spaceship',
  'a space station',
  'a room full of alients',
  'a science lab',
  'the Pentagon',
  'mars',
  'a colony on the moon',
  'inside a volcano',
  'amongst the clouds',
  'a submarine',
  'a strange crop circle in the midwest',
  'a dairy farm in the middle of nowhere',
  'a barn',
  'an elementary school',
  'a middle school',
  'a high school',
  'the cinema',
  'a playground',
  'a chapel',
  'las vegas',
  'central park',
  'a small town in Kansas',
  'a drugstore',
  'an electronics store',
  'an amazon warehouse',
  'an island off the coast of maine',
  'a crowded bar',
  'the middle of the woods',
  'a large house on the hill',
  'an old mansion that has long since been abandoned',
  'a junkyard',
  'a police station',
  "a detective's office",
  'a taxi car',
  'a penthouse',
  'a school',
  'a grocery store',
  'times square',
  'central park',
  'a small town in midwest usa',
  'an island off the coast of maine',
  'new york city',
  'an underground lab',
  'a garage',
  'a quiet street in the suburbs',
  'the Saloon',
  'the Barber shop',
  "old mackeys' horse farm",
  "the ladies' manor",
  "the mayor's house",
  'the Mansion at the edge of town',
  'a jail cell',
  'the gang hideout',
  'the hanging tree',
  'the river that runs through town',
  'the watering hole',
  "the dressmaker's shop",
  'the general goods store',
  'the bakery, the town hall',
  'the train tacks',
  'an open mic night at a bar',
  'a bathroom where every toilet is clogged',
  'a blood-stained urinal',
  'a gas station at midnight',
  'a quinceanera  for a cat',
  'a quinceanera for a dog',
  'a bounce house',
  "a child's birthday party with washed up clowns",
  'a clown car full of depressed clowns',
  'an alternate universe where everyone wears pants on their head',
  'a tree house',
  'a tree house where the vines are sentient',
  'a retirement community in Florida',
  'a 24/hr gym',
  'a secret shrine dedicated to Nicholas Cage',
];

const objects = [
  'a rusty nail',
  'an old purse',
  'an old sock',
  'a bloody knife',
  'a chainsaw',
  'dual swords',
  'a beretta',
  'a sword',
  'a chainmail shirt',
  'a gallon of milk',
  'a large box of wine',
  "yesterday's coffee cup",
  '1 role of toilet paper',
  'a deodorant stick',
  'an apple',
  'a pear',
  "a baby's bottle",
  'a bloody rag',
  'half a bag of popcorn',
  'a partially eaten rotisserie chicken',
  'a box of 3 hard-shell tacos',
  'a wedding cake',
  'a tooth, a pair of dentures',
  'a straightjacket',
  'a worn out fur coat',
  'a coffin',
  'a hearse',
  'a large metal pipe',
  'a marshmallow shooter',
  'a giant lollipop',
  'a rose',
  'a box of chocolates',
  'a well written love letter',
  'an awkward but honest love letter',
  'an old photo of the one that got away',
  'a dear john letter',
  'a break-up letter',
  'a book about how to date',
  'a pair of glasses',
  'a wine bottle',
  'a bottle of vodka',
  'a charcuterie board',
  'a picnic basket full of red wine and snacks',
  'a box of old letters',
  'a box of old love letters',
  'an old mixed tape',
  'an old wedding video',
  'a diary',
  'a journal',
  'a little black book',
  'an old letter that was lost in the mail, but finally delivered years later',
  'a magic wand',
  'a bubbling cauldron',
  'a magic lamp',
  'an enchanted book',
  'an enchanted sword',
  'an enchanted doll',
  'a cursed apple',
  'a poisoned pear',
  'a magic cake',
  'an enchanted chair',
  'an enchanted sock',
  'a sock that changes colors dependong on the mood',
  'a spell book',
  'a basket of magical herbs',
  'a suit of armor',
  "a dragon's tooth",
  'a set of gryphon claws',
  "a gryphon's tail",
  "a rabbit's foot",
  'a magic corset',
  'an enchanted carriage',
  'a pickle',
  'an enchanted donut',
  'a magical easy-bake oven',
  'a magic quill',
  'a magic quill that will create whatever objects you write into it',
  "a mirror that reveals a person's true form",
  'a mirror that shows what people want to see',
  'an envelope full of divorce papers',
  'a letter of resignation',
  'an old photo of a long lost love',
  'an old photo of a long lost relative',
  'an old photo of a relative that has passed on',
  'an old photo of an estranged dear friend',
  'an old diary',
  'an old scrap book',
  'a 1-way plane ticket',
  'a duffle bag full of clothes',
  'a duffle bag full of money',
  'a suitcase full of contraband',
  'a scarf',
  'an old sock',
  'an old baby sock',
  'a small glass statue of a duck',
  'a wooden duck',
  'a quilt',
  'a bible',
  "a copy of 'The Great Gatsby'",
  'a hello kity pen',
  'a pair of panties',
  'a high heel shoe',
  'a pair of louboutins',
  'a cup of tea',
  'a cup of coffee',
  'a sandwhich',
  'a salad',
  'a lost cell phone',
  'a stack of tax forms',
  'a 3-ft stack of paperwork',
  'divorce papers',
  'a basket of fruit',
  'a box of letters',
  'an old copy of The Little Prince',
  'an old journal',
  'a camera',
  'a lollipop',
  'a cup of coffee',
  'a sandwhich',
  'a salad',
  'a protein bar',
  'a walkman',
  'a lost cell phone',
  'the softest pillow in the world',
  'a roomba',
  'a vaccum cleaner',
  'a bottle of dish soap',
  'a box of mr. clean magic erasers',
  'a dust pan and broom set',
  'a sponge',
  'a pair of scissors',
  'a pet leash',
  ' a doll',
  'a toy gun',
  'a bag of groceries',
  'a rotisserie chicken',
  'a lost diary',
  'a school yearbook',
  'a college application',
  'a bottle of cheap booze',
  'a pregnancy test',
  'a book of spells',
  'a box of chocolates',
  'a letter from a secret admirer',
  'an envelope full of 2 concert tickets',
  'a padlock',
  'a bycicle',
  'a unicycle',
  'an acceptance letter',
  'a trumpet',
  'a violin',
  'a box of sheet music',
  'a lost cell phone',
  'a protein bar',
  'a basketball',
  'a football',
  'a soccer ball',
  'a laser gun',
  'a device that translates any language in the universe',
  'a time machine that can fit in the palm of your hand',
  'a shrunken alien head',
  "an envelope of top secret gov't documents",
  'a corb cob',
  'a scarecrow',
  'an unusually large meatball made of mysterious meat',
  'a glowing orb',
  'a vial with a strange blue liquid',
  'a glob of goo',
  'a pineappble',
  'a flying shoe',
  'a flying sock',
  'a floating mirror',
  'a floating rock',
  'a backpack',
  'an oxygen tank',
  'old astronaut food',
  'a coffee cup',
  'a lukewarm cup of tea',
  'a sword',
  'a sword that can repair instead of inflicting damage',
  'the softest pillow ever',
  'a bloody knife',
  'a bloody cloth',
  'a bloody dress',
  'a necklace of pricesless jewels',
  'a box of old letters',
  'an envelope of divorce papers',
  'a rotisserie chicken',
  'a wedding invitation',
  'an old journal',
  'an old diary',
  'a book',
  'a pipe',
  'a smoking jacket',
  'a bottle of vodka',
  'a half consumed bottle of wine',
  'a box full of shoes',
  'a box full of priceless jewelery',
  'a box full of teeth',
  'a box full of undergarments',
  'a box full of passports',
  'a box full of fake ids',
  'a box full of moonshine',
  'a basket of cherry pits and stems',
  'an orange',
  'a persimmon',
  'a pineapple',
  'a box full of dead bugs',
  'a blood stained shoe',
  'a car with lasers attached to it',
  'a car with machine guns attached',
  'a super fast car that can glide in the air when necessary',
  'a shield that can deflect almost anything',
  'a shotgun',
  'a satchel of water',
  'a can of beans',
  'a horse saddle',
  'a barrel of whiskey',
  'a piano',
  'a self-playing piano',
  'a tin can of fine tobacco',
  'a satchel of money',
  'a pair of ear plugs',
  'a set of dentures',
  'a perfume bottle',
  'a whoopie cushion',
  'a snake hat',
  'a box of baby wipes',
  'a pair of pants with a tear in the crotchal reigion',
  'a nickelback cd',
  '2 tickets to a nickelback concert',
  'a nickelback fanbook',
  'a signed nickelback poster',
];

const characters = [
  'a zombie bride',
  'a zombie groom',
  'a zombie baby',
  'a vampire bride',
  'a vampire groom',
  'a vampire baby',
  'a malnourished victorian orphan',
  'a malnourished child named Charlie',
  'a cat with 2 tails',
  'a dog with 3 eyes',
  'little cousin Agatha',
  'a lich',
  'a ghost',
  'a banshee',
  'a zombie baker',
  'a werewolf named Stanley',
  'a werewolf named Janice',
  'a werewolf',
  'a shapeshifter',
  'an elder vampire',
  'a shapeshifter named Bob',
  'a shapeshifter named Sarah',
  'a giant spider that knows telepathy',
  'a wall street zombie',
  'a battle baby',
  'an undercover Prince',
  'an undercover Princess',
  "a single mother who's given up on love",
  "a single father who's given up on love",
  'a lonely widow',
  'an adult who has never been in love',
  "a romance skeptic who is convinced they'll never fall in love",
  'a lady named Bob',
  'an average Joe named Joseph',
  'a lonely movie star disillusioned by hollywood who comes home to find themself',
  'an heiress to a vast fortune',
  'a lonely billionaire who just wants to chill and eat corndogs',
  'a playboy down on his luck',
  'a reformed criminal',
  'a hitman',
  'a mob boss',
  'a shy school teacher',
  'a shy librarian',
  'an overworked lawyer',
  'an overworked hollywood executive',
  'a unicorn with telepathy',
  'a lonely dragon',
  'an evil dragon',
  'a wicked witch',
  'a misunderstood witch',
  'a not-so-evil stepmother',
  'a dragon that is way too insecure about its size',
  'a greedy king',
  'a greedy queen',
  'a cursed prince',
  'a cursed princess',
  'a warlock',
  'a wizard',
  'a witch',
  'a warlock with a drinking problem',
  'a wizard with a drinking problem',
  'a witch with a drinking problem',
  'a cursed blacksmith',
  'an incompotent blacksmith',
  'a blacksmith',
  'a lich',
  'a magic baker',
  "a food critic who can feel people's emotions by tasting the food they make",
  'a mermaid',
  "a siren that doesn't want to hurt people but underestimates the strength of their siren call",
  'a reverse mermaid',
  'just your generic sentient magic mirror named Chuck',
  'an estranged cousin',
  'an estranged sister',
  'an estranged brother',
  'an estranged sibling',
  'an estranged parent',
  'an estranged child',
  'a long lost lover',
  'a mob boss',
  'a doctor',
  'a nurse',
  'a librarian',
  'a serial killer',
  'a private investigator',
  'an overworked businessman',
  'an oevrworked business woman',
  'a single parent',
  'a single mother',
  'a single father',
  'a smart and snarky child stuck in the foster system',
  'a lonely housewife in a loveless marriage',
  'a trophy wife bored of her doting husband',
  'a successful CEO bored of his loving wife',
  'a tormented artist',
  "a writer with writer's block",
  'a composer searching for their muse',
  'a personal trainer seeking deeper meaning in life',
  'some person named Bob',
  'some person named Judy',
  'someone named Darryl',
  'you boss, Angela',
  'the crazy cat lady that lives down the street',
  'a weird uncle',
  'a werid aunt',
  'a child',
  'a crying baby',
  'a child who drank too much coffee',
  'a teen that tries too hard',
  'a know-it-all college student',
  'a jaded writer',
  'an elderly lady who knows how to party',
  'a doctor',
  'a nurse',
  'an overworked businessman',
  'an overworked business woman',
  'a single parent',
  'a firefighter',
  'a school teacher',
  'a burnt out back-end web developer',
  'a burnt out front-end web developer',
  'a penci pusher',
  'a wall street worker',
  'a pop star who goes to public school',
  'a nerd who is secretly a pop star',
  'the attractive high school senior with a supernatural secret',
  'a nerd',
  'a jock',
  'a cheerleader',
  'a popular kid',
  'the school sweetheart with a dark secret',
  'the class president',
  'the school druggie',
  'the star football player',
  "the school's best swimmer",
  'the popular kid who is in all the school plays',
  'the homecoming queen who is not what they seem',
  'the homecoming king who is not what they seem',
  'the school principal',
  'a boy band',
  'a goth kid who secretly loves pink',
  'a school news paper photographer',
  'a school news paper reporter',
  'a school bully',
  'the chapter president of a sorority',
  'the chapter president of a fraternity',
  'a dude with his guitar who plays in the hallway of his dorm throughout the night',
  'the new member of a sorority',
  'the new member of a fraternity',
  'the first chair in the orchestra',
  'a professor',
  'an attractive professor that students crush on',
  'a battle baby',
  'an alien with two heads',
  'an alien',
  'a sentient talking banana',
  'an anthropomorphic lizard',
  'an anthropomorphic snake',
  'anthropomorphic cat',
  'an anthropomorphic dog',
  'an anthropomorphic duck',
  'an anthropomorphic chicken',
  'an anthropomorphic hedgehog',
  'an anthropomorphic bird',
  'an anthropomorphic fox',
  'an anthropomorphic fish',
  'an anthropomorphic flea',
  'an anthropomorphic penguin',
  'an alient that is disguised as a human',
  'a sentient orb',
  'a sentient rock that can communicate through telepathy',
  "a jaded detective who's had enough of this shat",
  "a taxi driver that's seen a lot",
  'a widow',
  'a wealthy widow',
  'a person suffering from amnesia',
  'a butler',
  'a maid',
  'an oprhaned heir/heiress',
  'a mob boss',
  'a gangster',
  'a hitman',
  'an assasin for hire who has standards',
  'a doctor',
  'a psychiatrist',
  'a therapist',
  'a teacher',
  'a school girl',
  'a school boy',
  "a sentient sword named 'swordy mcswordyface'",
  'a super hero whose power is the ability to make bathrooms spontaneously appear',
  'a super hero with the power to bake the perfect pizza',
  'a super villain whose goal is make all ',
  'a sheriff',
  'a criminal wanted for stealing 5 horses',
  'a criminal wanted for murder',
  "a criminal wanted for kidnapping the mayor's daughter",
  'a criminal wanted for kidnapping',
  'a cat with a bow tie',
  'a clown named Henry',
  'a clown named Darla',
  'a chicken that thinks everything tastes like chicken',
  'a sentient pickle intent on discovering the meaning of life',
  'a supervillain with daddy issues',
  'a supervillain with mommy issues',
  'a well-dressed, talking hairless cat named Branson',
  'a mermaid with a drinking problem',
  'an alien with a drinking problem',
  'a child psychologist',
  'a speech therapist',
  'an anthropomorphic sea creature',
  'an anthropomorphic pterodactyl',
  'an anthropomorphic spider',
  'a sentient Banana named Edward',
];
