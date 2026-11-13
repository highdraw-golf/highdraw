import { createHmac, timingSafeEqual } from 'node:crypto';

export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  setHeader(name: string, value: string): unknown;
  status(code: number): ApiResponse;
  json(payload: unknown): unknown;
  end(): unknown;
}

export interface ServerLedgerProduct {
  id: string;
  blueprintId: number;
  title: string;
  variants: Record<string, number>;
}

export interface PrintifyLineItemSpec {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface StripeGatewayDeps {
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  printifyApiToken?: string;
  printifyShopId?: string;
  fetchImpl?: typeof fetch;
}

export const SERVER_PRINTIFY_LEDGER: Record<string, ServerLedgerProduct> = {
  "6af3aaa484c3e9e3630db3bf": {
    "id": "6af3aaa484c3e9e3630db3bf",
    "blueprintId": 3322,
    "title": "High Draw Weekender Women's Polo — Mark + Wordmark",
    "variants": {
      "XS / Black": 189058,
      "XS / Carolina Blue": 189069,
      "XS / Deep Red": 189074,
      "XS / Graphite": 189084,
      "XS / Grey Concrete": 189093,
      "XS / True Navy": 189100,
      "XS / True Royal": 189106,
      "XS / White": 189113,
      "S / White": 189117,
      "S / True Royal": 189119,
      "S / True Navy": 189120,
      "S / Grey Concrete": 189122,
      "S / Graphite": 189123,
      "S / Deep Red": 189126,
      "S / Carolina Blue": 189129,
      "S / Black": 189131,
      "M / Carolina Blue": 189138,
      "M / Black": 189142,
      "M / Deep Red": 189144,
      "M / Graphite": 189145,
      "M / Grey Concrete": 189148,
      "M / True Navy": 189150,
      "M / True Royal": 189152,
      "M / White": 189155,
      "L / White": 189164,
      "L / True Royal": 189167,
      "L / True Navy": 189172,
      "L / Grey Concrete": 189175,
      "L / Graphite": 189178,
      "L / Deep Red": 189181,
      "L / Black": 189185,
      "L / Carolina Blue": 189187,
      "XL / Black": 189194,
      "XL / Carolina Blue": 189197,
      "XL / Deep Red": 189203,
      "XL / Graphite": 189208,
      "XL / Grey Concrete": 189211,
      "XL / True Navy": 189215,
      "XL / True Royal": 189219,
      "XL / White": 189224,
      "XXL / White": 189233,
      "XXL / True Royal": 189236,
      "XXL / True Navy": 189239,
      "XXL / Grey Concrete": 189244,
      "XXL / Graphite": 189247,
      "XXL / Deep Red": 189251,
      "XXL / Carolina Blue": 189254,
      "XXL / Black": 189260,
      "3XL / Carolina Blue": 189270,
      "3XL / Black": 189275,
      "3XL / Deep Red": 189280,
      "3XL / Graphite": 189284,
      "3XL / Grey Concrete": 189291,
      "3XL / True Navy": 189295,
      "3XL / True Royal": 189297,
      "3XL / White": 189300,
      "4XL / White": 189311,
      "4XL / True Royal": 189315,
      "4XL / True Navy": 189317,
      "4XL / Grey Concrete": 189319,
      "4XL / Graphite": 189322,
      "4XL / Deep Red": 189324,
      "4XL / Black": 189326,
      "4XL / Carolina Blue": 189328
    }
  },
  "6af3aaa1edb592ae87061652": {
    "id": "6af3aaa1edb592ae87061652",
    "blueprintId": 3322,
    "title": "High Draw Weekender Women's Polo — Mark + Monogram",
    "variants": {
      "XS / Black": 189058,
      "XS / Carolina Blue": 189069,
      "XS / Deep Red": 189074,
      "XS / Graphite": 189084,
      "XS / Grey Concrete": 189093,
      "XS / True Navy": 189100,
      "XS / True Royal": 189106,
      "XS / White": 189113,
      "S / White": 189117,
      "S / True Royal": 189119,
      "S / True Navy": 189120,
      "S / Grey Concrete": 189122,
      "S / Graphite": 189123,
      "S / Deep Red": 189126,
      "S / Carolina Blue": 189129,
      "S / Black": 189131,
      "M / Carolina Blue": 189138,
      "M / Black": 189142,
      "M / Deep Red": 189144,
      "M / Graphite": 189145,
      "M / Grey Concrete": 189148,
      "M / True Navy": 189150,
      "M / True Royal": 189152,
      "M / White": 189155,
      "L / White": 189164,
      "L / True Royal": 189167,
      "L / True Navy": 189172,
      "L / Grey Concrete": 189175,
      "L / Graphite": 189178,
      "L / Deep Red": 189181,
      "L / Black": 189185,
      "L / Carolina Blue": 189187,
      "XL / Black": 189194,
      "XL / Carolina Blue": 189197,
      "XL / Deep Red": 189203,
      "XL / Graphite": 189208,
      "XL / Grey Concrete": 189211,
      "XL / True Navy": 189215,
      "XL / True Royal": 189219,
      "XL / White": 189224,
      "XXL / White": 189233,
      "XXL / True Royal": 189236,
      "XXL / True Navy": 189239,
      "XXL / Grey Concrete": 189244,
      "XXL / Graphite": 189247,
      "XXL / Deep Red": 189251,
      "XXL / Carolina Blue": 189254,
      "XXL / Black": 189260,
      "3XL / Carolina Blue": 189270,
      "3XL / Black": 189275,
      "3XL / Deep Red": 189280,
      "3XL / Graphite": 189284,
      "3XL / Grey Concrete": 189291,
      "3XL / True Navy": 189295,
      "3XL / True Royal": 189297,
      "3XL / White": 189300,
      "4XL / White": 189311,
      "4XL / True Royal": 189315,
      "4XL / True Navy": 189317,
      "4XL / Grey Concrete": 189319,
      "4XL / Graphite": 189322,
      "4XL / Deep Red": 189324,
      "4XL / Black": 189326,
      "4XL / Carolina Blue": 189328
    }
  },
  "6af3aa9f45f16ba7160360a9": {
    "id": "6af3aa9f45f16ba7160360a9",
    "blueprintId": 3322,
    "title": "High Draw Weekender Women's Polo — Mark-Only",
    "variants": {
      "XS / Black": 189058,
      "XS / Carolina Blue": 189069,
      "XS / Deep Red": 189074,
      "XS / Graphite": 189084,
      "XS / Grey Concrete": 189093,
      "XS / True Navy": 189100,
      "XS / True Royal": 189106,
      "XS / White": 189113,
      "S / White": 189117,
      "S / True Royal": 189119,
      "S / True Navy": 189120,
      "S / Grey Concrete": 189122,
      "S / Graphite": 189123,
      "S / Deep Red": 189126,
      "S / Carolina Blue": 189129,
      "S / Black": 189131,
      "M / Carolina Blue": 189138,
      "M / Black": 189142,
      "M / Deep Red": 189144,
      "M / Graphite": 189145,
      "M / Grey Concrete": 189148,
      "M / True Navy": 189150,
      "M / True Royal": 189152,
      "M / White": 189155,
      "L / White": 189164,
      "L / True Royal": 189167,
      "L / True Navy": 189172,
      "L / Grey Concrete": 189175,
      "L / Graphite": 189178,
      "L / Deep Red": 189181,
      "L / Black": 189185,
      "L / Carolina Blue": 189187,
      "XL / Black": 189194,
      "XL / Carolina Blue": 189197,
      "XL / Deep Red": 189203,
      "XL / Graphite": 189208,
      "XL / Grey Concrete": 189211,
      "XL / True Navy": 189215,
      "XL / True Royal": 189219,
      "XL / White": 189224,
      "XXL / White": 189233,
      "XXL / True Royal": 189236,
      "XXL / True Navy": 189239,
      "XXL / Grey Concrete": 189244,
      "XXL / Graphite": 189247,
      "XXL / Deep Red": 189251,
      "XXL / Carolina Blue": 189254,
      "XXL / Black": 189260,
      "3XL / Carolina Blue": 189270,
      "3XL / Black": 189275,
      "3XL / Deep Red": 189280,
      "3XL / Graphite": 189284,
      "3XL / Grey Concrete": 189291,
      "3XL / True Navy": 189295,
      "3XL / True Royal": 189297,
      "3XL / White": 189300,
      "4XL / White": 189311,
      "4XL / True Royal": 189315,
      "4XL / True Navy": 189317,
      "4XL / Grey Concrete": 189319,
      "4XL / Graphite": 189322,
      "4XL / Deep Red": 189324,
      "4XL / Black": 189326,
      "4XL / Carolina Blue": 189328
    }
  },
  "6af3a9c86bc401c89f08b39d": {
    "id": "6af3a9c86bc401c89f08b39d",
    "blueprintId": 2026,
    "title": "High Draw Clubhouse Women's Polo — Mark + Wordmark",
    "variants": {
      "XS / Aegean Blue Heather": 124472,
      "S / Aegean Blue Heather": 124473,
      "M / Aegean Blue Heather": 124474,
      "L / Aegean Blue Heather": 124475,
      "XL / Aegean Blue Heather": 124476,
      "2XL / Aegean Blue Heather": 124477,
      "3XL / Aegean Blue Heather": 124478,
      "4XL / Aegean Blue Heather": 124479,
      "XS / Black Heather": 124480,
      "S / Black Heather": 124481,
      "M / Black Heather": 124482,
      "L / Black Heather": 124483,
      "XL / Black Heather": 124484,
      "2XL / Black Heather": 124485,
      "3XL / Black Heather": 124486,
      "4XL / Black Heather": 124487,
      "XS / Charcoal Heather": 124488,
      "S / Charcoal Heather": 124489,
      "M / Charcoal Heather": 124490,
      "L / Charcoal Heather": 124491,
      "XL / Charcoal Heather": 124492,
      "2XL / Charcoal Heather": 124493,
      "3XL / Charcoal Heather": 124494,
      "4XL / Charcoal Heather": 124495,
      "XS / Dark Teal Heather": 124496,
      "S / Dark Teal Heather": 124497,
      "M / Dark Teal Heather": 124498,
      "L / Dark Teal Heather": 124499,
      "XL / Dark Teal Heather": 124500,
      "2XL / Dark Teal Heather": 124501,
      "3XL / Dark Teal Heather": 124502,
      "4XL / Dark Teal Heather": 124503
    }
  },
  "6af3a9c684c3e9e3630db348": {
    "id": "6af3a9c684c3e9e3630db348",
    "blueprintId": 2026,
    "title": "High Draw Clubhouse Women's Polo — Mark + Monogram",
    "variants": {
      "XS / Aegean Blue Heather": 124472,
      "S / Aegean Blue Heather": 124473,
      "M / Aegean Blue Heather": 124474,
      "L / Aegean Blue Heather": 124475,
      "XL / Aegean Blue Heather": 124476,
      "2XL / Aegean Blue Heather": 124477,
      "3XL / Aegean Blue Heather": 124478,
      "4XL / Aegean Blue Heather": 124479,
      "XS / Black Heather": 124480,
      "S / Black Heather": 124481,
      "M / Black Heather": 124482,
      "L / Black Heather": 124483,
      "XL / Black Heather": 124484,
      "2XL / Black Heather": 124485,
      "3XL / Black Heather": 124486,
      "4XL / Black Heather": 124487,
      "XS / Charcoal Heather": 124488,
      "S / Charcoal Heather": 124489,
      "M / Charcoal Heather": 124490,
      "L / Charcoal Heather": 124491,
      "XL / Charcoal Heather": 124492,
      "2XL / Charcoal Heather": 124493,
      "3XL / Charcoal Heather": 124494,
      "4XL / Charcoal Heather": 124495,
      "XS / Dark Teal Heather": 124496,
      "S / Dark Teal Heather": 124497,
      "M / Dark Teal Heather": 124498,
      "L / Dark Teal Heather": 124499,
      "XL / Dark Teal Heather": 124500,
      "2XL / Dark Teal Heather": 124501,
      "3XL / Dark Teal Heather": 124502,
      "4XL / Dark Teal Heather": 124503
    }
  },
  "6af3a9c33fb498bd1209db55": {
    "id": "6af3a9c33fb498bd1209db55",
    "blueprintId": 2026,
    "title": "High Draw Clubhouse Women's Polo — Mark-Only",
    "variants": {
      "XS / Aegean Blue Heather": 124472,
      "S / Aegean Blue Heather": 124473,
      "M / Aegean Blue Heather": 124474,
      "L / Aegean Blue Heather": 124475,
      "XL / Aegean Blue Heather": 124476,
      "2XL / Aegean Blue Heather": 124477,
      "3XL / Aegean Blue Heather": 124478,
      "4XL / Aegean Blue Heather": 124479,
      "XS / Black Heather": 124480,
      "S / Black Heather": 124481,
      "M / Black Heather": 124482,
      "L / Black Heather": 124483,
      "XL / Black Heather": 124484,
      "2XL / Black Heather": 124485,
      "3XL / Black Heather": 124486,
      "4XL / Black Heather": 124487,
      "XS / Charcoal Heather": 124488,
      "S / Charcoal Heather": 124489,
      "M / Charcoal Heather": 124490,
      "L / Charcoal Heather": 124491,
      "XL / Charcoal Heather": 124492,
      "2XL / Charcoal Heather": 124493,
      "3XL / Charcoal Heather": 124494,
      "4XL / Charcoal Heather": 124495,
      "XS / Dark Teal Heather": 124496,
      "S / Dark Teal Heather": 124497,
      "M / Dark Teal Heather": 124498,
      "L / Dark Teal Heather": 124499,
      "XL / Dark Teal Heather": 124500,
      "2XL / Dark Teal Heather": 124501,
      "3XL / Dark Teal Heather": 124502,
      "4XL / Dark Teal Heather": 124503
    }
  },
  "6af3a8c6435863c2bb0d32f4": {
    "id": "6af3a8c6435863c2bb0d32f4",
    "blueprintId": 2038,
    "title": "High Draw Clubhouse Men's Polo — Mark + Wordmark",
    "variants": {
      "XS / Aegean Blue Heather": 125298,
      "S / Aegean Blue Heather": 125299,
      "M / Aegean Blue Heather": 125300,
      "L / Aegean Blue Heather": 125301,
      "XL / Aegean Blue Heather": 125302,
      "2XL / Aegean Blue Heather": 125303,
      "3XL / Aegean Blue Heather": 125304,
      "4XL / Aegean Blue Heather": 125305,
      "XS / Black Heather": 125306,
      "S / Black Heather": 125307,
      "M / Black Heather": 125308,
      "L / Black Heather": 125309,
      "XL / Black Heather": 125310,
      "2XL / Black Heather": 125311,
      "3XL / Black Heather": 125312,
      "4XL / Black Heather": 125313,
      "XS / Charcoal Heather": 125314,
      "S / Charcoal Heather": 125315,
      "M / Charcoal Heather": 125316,
      "L / Charcoal Heather": 125317,
      "XL / Charcoal Heather": 125318,
      "2XL / Charcoal Heather": 125319,
      "3XL / Charcoal Heather": 125320,
      "4XL / Charcoal Heather": 125321,
      "XS / Dark Teal Heather": 125322,
      "S / Dark Teal Heather": 125323,
      "M / Dark Teal Heather": 125324,
      "L / Dark Teal Heather": 125325,
      "XL / Dark Teal Heather": 125326,
      "2XL / Dark Teal Heather": 125327,
      "3XL / Dark Teal Heather": 125328,
      "4XL / Dark Teal Heather": 125329,
      "XS / River Blue Navy Heather": 125330,
      "S / River Blue Navy Heather": 125331,
      "M / River Blue Navy Heather": 125332,
      "L / River Blue Navy Heather": 125333,
      "XL / River Blue Navy Heather": 125334,
      "2XL / River Blue Navy Heather": 125335,
      "3XL / River Blue Navy Heather": 125336,
      "4XL / River Blue Navy Heather": 125337
    }
  },
  "6af3a8c3cb8adff71a02ba5e": {
    "id": "6af3a8c3cb8adff71a02ba5e",
    "blueprintId": 2038,
    "title": "High Draw Clubhouse Men's Polo — Mark + Monogram",
    "variants": {
      "XS / Aegean Blue Heather": 125298,
      "S / Aegean Blue Heather": 125299,
      "M / Aegean Blue Heather": 125300,
      "L / Aegean Blue Heather": 125301,
      "XL / Aegean Blue Heather": 125302,
      "2XL / Aegean Blue Heather": 125303,
      "3XL / Aegean Blue Heather": 125304,
      "4XL / Aegean Blue Heather": 125305,
      "XS / Black Heather": 125306,
      "S / Black Heather": 125307,
      "M / Black Heather": 125308,
      "L / Black Heather": 125309,
      "XL / Black Heather": 125310,
      "2XL / Black Heather": 125311,
      "3XL / Black Heather": 125312,
      "4XL / Black Heather": 125313,
      "XS / Charcoal Heather": 125314,
      "S / Charcoal Heather": 125315,
      "M / Charcoal Heather": 125316,
      "L / Charcoal Heather": 125317,
      "XL / Charcoal Heather": 125318,
      "2XL / Charcoal Heather": 125319,
      "3XL / Charcoal Heather": 125320,
      "4XL / Charcoal Heather": 125321,
      "XS / Dark Teal Heather": 125322,
      "S / Dark Teal Heather": 125323,
      "M / Dark Teal Heather": 125324,
      "L / Dark Teal Heather": 125325,
      "XL / Dark Teal Heather": 125326,
      "2XL / Dark Teal Heather": 125327,
      "3XL / Dark Teal Heather": 125328,
      "4XL / Dark Teal Heather": 125329,
      "XS / River Blue Navy Heather": 125330,
      "S / River Blue Navy Heather": 125331,
      "M / River Blue Navy Heather": 125332,
      "L / River Blue Navy Heather": 125333,
      "XL / River Blue Navy Heather": 125334,
      "2XL / River Blue Navy Heather": 125335,
      "3XL / River Blue Navy Heather": 125336,
      "4XL / River Blue Navy Heather": 125337
    }
  },
  "6af3a8c1cb8adff71a02ba5b": {
    "id": "6af3a8c1cb8adff71a02ba5b",
    "blueprintId": 2038,
    "title": "High Draw Clubhouse Men's Polo — Mark-Only",
    "variants": {
      "XS / Aegean Blue Heather": 125298,
      "S / Aegean Blue Heather": 125299,
      "M / Aegean Blue Heather": 125300,
      "L / Aegean Blue Heather": 125301,
      "XL / Aegean Blue Heather": 125302,
      "2XL / Aegean Blue Heather": 125303,
      "3XL / Aegean Blue Heather": 125304,
      "4XL / Aegean Blue Heather": 125305,
      "XS / Black Heather": 125306,
      "S / Black Heather": 125307,
      "M / Black Heather": 125308,
      "L / Black Heather": 125309,
      "XL / Black Heather": 125310,
      "2XL / Black Heather": 125311,
      "3XL / Black Heather": 125312,
      "4XL / Black Heather": 125313,
      "XS / Charcoal Heather": 125314,
      "S / Charcoal Heather": 125315,
      "M / Charcoal Heather": 125316,
      "L / Charcoal Heather": 125317,
      "XL / Charcoal Heather": 125318,
      "2XL / Charcoal Heather": 125319,
      "3XL / Charcoal Heather": 125320,
      "4XL / Charcoal Heather": 125321,
      "XS / Dark Teal Heather": 125322,
      "S / Dark Teal Heather": 125323,
      "M / Dark Teal Heather": 125324,
      "L / Dark Teal Heather": 125325,
      "XL / Dark Teal Heather": 125326,
      "2XL / Dark Teal Heather": 125327,
      "3XL / Dark Teal Heather": 125328,
      "4XL / Dark Teal Heather": 125329,
      "XS / River Blue Navy Heather": 125330,
      "S / River Blue Navy Heather": 125331,
      "M / River Blue Navy Heather": 125332,
      "L / River Blue Navy Heather": 125333,
      "XL / River Blue Navy Heather": 125334,
      "2XL / River Blue Navy Heather": 125335,
      "3XL / River Blue Navy Heather": 125336,
      "4XL / River Blue Navy Heather": 125337
    }
  },
  "6af3a55dcb8adff71a02b775": {
    "id": "6af3a55dcb8adff71a02b775",
    "blueprintId": 1984,
    "title": "High Draw Weekender Men's Polo — Mark + Monogram",
    "variants": {
      "2XL / Black": 122428,
      "2XL / Carolina Blue": 122429,
      "2XL / Deep Red": 122430,
      "2XL / Forest Green": 122431,
      "2XL / Graphite": 122432,
      "2XL / Grey Concrete": 122433,
      "2XL / True Navy": 122434,
      "2XL / True Royal": 122435,
      "2XL / White": 122436,
      "3XL / Black": 122437,
      "3XL / Carolina Blue": 122438,
      "3XL / Deep Red": 122439,
      "3XL / Forest Green": 122440,
      "3XL / Graphite": 122441,
      "3XL / Grey Concrete": 122442,
      "3XL / True Navy": 122443,
      "3XL / True Royal": 122444,
      "3XL / White": 122445,
      "4XL / Black": 122446,
      "4XL / Carolina Blue": 122447,
      "4XL / Deep Red": 122448,
      "4XL / Forest Green": 122449,
      "4XL / Graphite": 122450,
      "4XL / Grey Concrete": 122451,
      "4XL / True Navy": 122452,
      "4XL / True Royal": 122453,
      "4XL / White": 122454,
      "L / Black": 122455,
      "L / Carolina Blue": 122456,
      "L / Deep Red": 122457,
      "L / Forest Green": 122458,
      "L / Graphite": 122459,
      "L / Grey Concrete": 122460,
      "L / True Navy": 122461,
      "L / True Royal": 122462,
      "L / White": 122463,
      "M / Black": 122464,
      "M / Carolina Blue": 122465,
      "M / Deep Red": 122466,
      "M / Forest Green": 122467,
      "M / Graphite": 122468,
      "M / Grey Concrete": 122469,
      "M / True Navy": 122470,
      "M / True Royal": 122471,
      "M / White": 122472,
      "S / Black": 122473,
      "S / Carolina Blue": 122474,
      "S / Deep Red": 122475,
      "S / Forest Green": 122476,
      "S / Graphite": 122477,
      "S / Grey Concrete": 122478,
      "S / True Navy": 122479,
      "S / True Royal": 122480,
      "S / White": 122481,
      "XL / Black": 122482,
      "XL / Carolina Blue": 122483,
      "XL / Deep Red": 122484,
      "XL / Forest Green": 122485,
      "XL / Graphite": 122486,
      "XL / Grey Concrete": 122487,
      "XL / True Navy": 122488,
      "XL / True Royal": 122489,
      "XL / White": 122490,
      "XS / Black": 122491,
      "XS / Carolina Blue": 122492,
      "XS / Deep Red": 122493,
      "XS / Forest Green": 122494,
      "XS / Graphite": 122495,
      "XS / Grey Concrete": 122496,
      "XS / True Navy": 122497,
      "XS / True Royal": 122498,
      "XS / White": 122499
    }
  },
  "6af3a4d66bc401c89f08aedd": {
    "id": "6af3a4d66bc401c89f08aedd",
    "blueprintId": 1984,
    "title": "High Draw Weekender Men's Polo — Mark + Wordmark",
    "variants": {
      "2XL / Black": 122428,
      "2XL / Carolina Blue": 122429,
      "2XL / Deep Red": 122430,
      "2XL / Forest Green": 122431,
      "2XL / Graphite": 122432,
      "2XL / Grey Concrete": 122433,
      "2XL / True Navy": 122434,
      "2XL / True Royal": 122435,
      "2XL / White": 122436,
      "3XL / Black": 122437,
      "3XL / Carolina Blue": 122438,
      "3XL / Deep Red": 122439,
      "3XL / Forest Green": 122440,
      "3XL / Graphite": 122441,
      "3XL / Grey Concrete": 122442,
      "3XL / True Navy": 122443,
      "3XL / True Royal": 122444,
      "3XL / White": 122445,
      "4XL / Black": 122446,
      "4XL / Carolina Blue": 122447,
      "4XL / Deep Red": 122448,
      "4XL / Forest Green": 122449,
      "4XL / Graphite": 122450,
      "4XL / Grey Concrete": 122451,
      "4XL / True Navy": 122452,
      "4XL / True Royal": 122453,
      "4XL / White": 122454,
      "L / Black": 122455,
      "L / Carolina Blue": 122456,
      "L / Deep Red": 122457,
      "L / Forest Green": 122458,
      "L / Graphite": 122459,
      "L / Grey Concrete": 122460,
      "L / True Navy": 122461,
      "L / True Royal": 122462,
      "L / White": 122463,
      "M / Black": 122464,
      "M / Carolina Blue": 122465,
      "M / Deep Red": 122466,
      "M / Forest Green": 122467,
      "M / Graphite": 122468,
      "M / Grey Concrete": 122469,
      "M / True Navy": 122470,
      "M / True Royal": 122471,
      "M / White": 122472,
      "S / Black": 122473,
      "S / Carolina Blue": 122474,
      "S / Deep Red": 122475,
      "S / Forest Green": 122476,
      "S / Graphite": 122477,
      "S / Grey Concrete": 122478,
      "S / True Navy": 122479,
      "S / True Royal": 122480,
      "S / White": 122481,
      "XL / Black": 122482,
      "XL / Carolina Blue": 122483,
      "XL / Deep Red": 122484,
      "XL / Forest Green": 122485,
      "XL / Graphite": 122486,
      "XL / Grey Concrete": 122487,
      "XL / True Navy": 122488,
      "XL / True Royal": 122489,
      "XL / White": 122490,
      "XS / Black": 122491,
      "XS / Carolina Blue": 122492,
      "XS / Deep Red": 122493,
      "XS / Forest Green": 122494,
      "XS / Graphite": 122495,
      "XS / Grey Concrete": 122496,
      "XS / True Navy": 122497,
      "XS / True Royal": 122498,
      "XS / White": 122499
    }
  },
  "6af3a431435863c2bb0d2efb": {
    "id": "6af3a431435863c2bb0d2efb",
    "blueprintId": 1984,
    "title": "High Draw Weekender Men's Polo — Mark-Only",
    "variants": {
      "2XL / Black": 122428,
      "2XL / Carolina Blue": 122429,
      "2XL / Deep Red": 122430,
      "2XL / Forest Green": 122431,
      "2XL / Graphite": 122432,
      "2XL / Grey Concrete": 122433,
      "2XL / True Navy": 122434,
      "2XL / True Royal": 122435,
      "2XL / White": 122436,
      "3XL / Black": 122437,
      "3XL / Carolina Blue": 122438,
      "3XL / Deep Red": 122439,
      "3XL / Forest Green": 122440,
      "3XL / Graphite": 122441,
      "3XL / Grey Concrete": 122442,
      "3XL / True Navy": 122443,
      "3XL / True Royal": 122444,
      "3XL / White": 122445,
      "4XL / Black": 122446,
      "4XL / Carolina Blue": 122447,
      "4XL / Deep Red": 122448,
      "4XL / Forest Green": 122449,
      "4XL / Graphite": 122450,
      "4XL / Grey Concrete": 122451,
      "4XL / True Navy": 122452,
      "4XL / True Royal": 122453,
      "4XL / White": 122454,
      "L / Black": 122455,
      "L / Carolina Blue": 122456,
      "L / Deep Red": 122457,
      "L / Forest Green": 122458,
      "L / Graphite": 122459,
      "L / Grey Concrete": 122460,
      "L / True Navy": 122461,
      "L / True Royal": 122462,
      "L / White": 122463,
      "M / Black": 122464,
      "M / Carolina Blue": 122465,
      "M / Deep Red": 122466,
      "M / Forest Green": 122467,
      "M / Graphite": 122468,
      "M / Grey Concrete": 122469,
      "M / True Navy": 122470,
      "M / True Royal": 122471,
      "M / White": 122472,
      "S / Black": 122473,
      "S / Carolina Blue": 122474,
      "S / Deep Red": 122475,
      "S / Forest Green": 122476,
      "S / Graphite": 122477,
      "S / Grey Concrete": 122478,
      "S / True Navy": 122479,
      "S / True Royal": 122480,
      "S / White": 122481,
      "XL / Black": 122482,
      "XL / Carolina Blue": 122483,
      "XL / Deep Red": 122484,
      "XL / Forest Green": 122485,
      "XL / Graphite": 122486,
      "XL / Grey Concrete": 122487,
      "XL / True Navy": 122488,
      "XL / True Royal": 122489,
      "XL / White": 122490,
      "XS / Black": 122491,
      "XS / Carolina Blue": 122492,
      "XS / Deep Red": 122493,
      "XS / Forest Green": 122494,
      "XS / Graphite": 122495,
      "XS / Grey Concrete": 122496,
      "XS / True Navy": 122497,
      "XS / True Royal": 122498,
      "XS / White": 122499
    }
  },
  "6af356e339e9d7101d062c32": {
    "id": "6af356e339e9d7101d062c32",
    "blueprintId": 3630,
    "title": "High Draw Clubhouse Fleece Quarter-Zip - Mark + Wordmark",
    "variants": {
      "XS / Black": 202339,
      "2XL / Black": 202342,
      "XS / Iron Grey": 202344,
      "2XL / Iron Grey": 202345,
      "XS / True Navy": 202350,
      "2XL / True Navy": 202352,
      "S / Black": 202354,
      "3XL / Black": 202355,
      "S / Iron Grey": 202357,
      "3XL / Iron Grey": 202359,
      "S / True Navy": 202361,
      "3XL / True Navy": 202363,
      "M / Black": 202366,
      "4XL / Black": 202370,
      "M / Iron Grey": 202371,
      "4XL / Iron Grey": 202372,
      "M / True Navy": 202373,
      "4XL / True Navy": 202375,
      "L / Black": 202379,
      "5XL / Black": 202380,
      "L / Iron Grey": 202381,
      "5XL / Iron Grey": 202382,
      "L / True Navy": 202383,
      "5XL / True Navy": 202384,
      "XL / Black": 202387,
      "6XL / Black": 202388,
      "XL / Iron Grey": 202389,
      "6XL / Iron Grey": 202390,
      "XL / True Navy": 202391,
      "6XL / True Navy": 202392
    }
  },
  "6af35680acad20a7f90be47d": {
    "id": "6af35680acad20a7f90be47d",
    "blueprintId": 3630,
    "title": "High Draw Clubhouse Fleece Quarter-Zip - Mark Only",
    "variants": {
      "XS / Black": 202339,
      "2XL / Black": 202342,
      "XS / Iron Grey": 202344,
      "2XL / Iron Grey": 202345,
      "XS / True Navy": 202350,
      "2XL / True Navy": 202352,
      "S / Black": 202354,
      "3XL / Black": 202355,
      "S / Iron Grey": 202357,
      "3XL / Iron Grey": 202359,
      "S / True Navy": 202361,
      "3XL / True Navy": 202363,
      "M / Black": 202366,
      "4XL / Black": 202370,
      "M / Iron Grey": 202371,
      "4XL / Iron Grey": 202372,
      "M / True Navy": 202373,
      "4XL / True Navy": 202375,
      "L / Black": 202379,
      "5XL / Black": 202380,
      "L / Iron Grey": 202381,
      "5XL / Iron Grey": 202382,
      "L / True Navy": 202383,
      "5XL / True Navy": 202384,
      "XL / Black": 202387,
      "6XL / Black": 202388,
      "XL / Iron Grey": 202389,
      "6XL / Iron Grey": 202390,
      "XL / True Navy": 202391,
      "6XL / True Navy": 202392
    }
  },
  "6af3547ffa34d65eed0a284b": {
    "id": "6af3547ffa34d65eed0a284b",
    "blueprintId": 3630,
    "title": "High Draw Clubhouse Fleece Quarter-Zip - Mark + Monogram",
    "variants": {
      "XS / Black": 202339,
      "2XL / Black": 202342,
      "XS / Iron Grey": 202344,
      "2XL / Iron Grey": 202345,
      "XS / True Navy": 202350,
      "2XL / True Navy": 202352,
      "S / Black": 202354,
      "3XL / Black": 202355,
      "S / Iron Grey": 202357,
      "3XL / Iron Grey": 202359,
      "S / True Navy": 202361,
      "3XL / True Navy": 202363,
      "M / Black": 202366,
      "4XL / Black": 202370,
      "M / Iron Grey": 202371,
      "4XL / Iron Grey": 202372,
      "M / True Navy": 202373,
      "4XL / True Navy": 202375,
      "L / Black": 202379,
      "5XL / Black": 202380,
      "L / Iron Grey": 202381,
      "5XL / Iron Grey": 202382,
      "L / True Navy": 202383,
      "5XL / True Navy": 202384,
      "XL / Black": 202387,
      "6XL / Black": 202388,
      "XL / Iron Grey": 202389,
      "6XL / Iron Grey": 202390,
      "XL / True Navy": 202391,
      "6XL / True Navy": 202392
    }
  },
  "6abac00a7ed05bbe6f073036": {
    "id": "6abac00a7ed05bbe6f073036",
    "blueprintId": 5272,
    "title": "Flexfit Cool & Dry Poly Block Mesh Cap",
    "variants": {
      "S/M / Black": 243294,
      "S/M / Grey Heather": 243295,
      "S/M / Magnet": 243296,
      "S/M / True Navy": 243297,
      "S/M / True Red": 243298,
      "S/M / True Royal": 243299,
      "S/M / White": 243300,
      "L/XL / Black": 243301,
      "L/XL / Grey Heather": 243302,
      "L/XL / Magnet": 243303,
      "L/XL / True Navy": 243304,
      "L/XL / True Red": 243305,
      "L/XL / True Royal": 243306,
      "L/XL / White": 243307
    }
  }
};

const ALLOWED_ORIGINS = new Set([
  'https://www.highdrawgear.com',
  'https://highdrawgear.com',
  'https://highdraw.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (/^https:\/\/highdraw-[a-z0-9]+-high-draw-gear\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

interface CatalogEntry {
  name: string;
  unitAmountCents: number;
}

const AUTHORITATIVE_CATALOG: Record<string, CatalogEntry> = {
  'men-polo-st740': {
    name: "The Weekender Performance Polo — Men's",
    unitAmountCents: 4800,
  },
  'men-polo-st740-upsell': {
    name: "The Weekender Performance Polo — Men's (Cap Bundle)",
    unitAmountCents: 4000,
  },
  'women-polo-lst740': {
    name: "The Weekender Performance Polo — Women's",
    unitAmountCents: 4800,
  },
  'men-polo-k830': {
    name: "The Clubhouse Fine Pique Polo — Men's",
    unitAmountCents: 6600,
  },
  'women-polo-lk830': {
    name: "The Clubhouse Fine Pique Polo — Women's",
    unitAmountCents: 6600,
  },
  'outerwear-f218-fleece': {
    name: 'The Clubhouse Value Fleece 1/4-Zip Pullover',
    unitAmountCents: 6800,
  },
  'outerwear-st443': {
    name: "The Tour Tech Quarter-Zip Pullover — Men's",
    unitAmountCents: 5600,
  },
  'headwear-flexfit-mesh': {
    name: 'The Tour Performance Poly-Mesh Cap',
    unitAmountCents: 3500,
  },
  'headwear-flexfit-mesh-upsell': {
    name: 'The Tour Performance Poly-Mesh Cap (Bundle Upsell)',
    unitAmountCents: 2800,
  },
  'bundle-foursome-01': {
    name: 'The Saturday Foursome Scramble Kit (4 Polos)',
    unitAmountCents: 16000,
  },
};

function resolveCatalogItem(
  rawId: string,
  clientPrice: number | undefined,
  allCartItems: Array<{ id?: unknown }>
): CatalogEntry | null {
  const cleanId = String(rawId || '').trim();
  const hasNonHeadwear = allCartItems.some(item => {
    const id = String(item?.id || '').trim();
    return Boolean(id) && !id.startsWith('headwear-flexfit-mesh');
  });
  const hasHeadwear = allCartItems.some(item =>
    String(item?.id || '').trim().startsWith('headwear-flexfit-mesh')
  );

  if (cleanId === 'headwear-flexfit-mesh-upsell' || cleanId.startsWith('headwear-flexfit-mesh')) {
    if (hasNonHeadwear && (clientPrice === 28 || cleanId === 'headwear-flexfit-mesh-upsell')) {
      return AUTHORITATIVE_CATALOG['headwear-flexfit-mesh-upsell'];
    }
    return AUTHORITATIVE_CATALOG['headwear-flexfit-mesh'];
  }

  if (cleanId.startsWith('men-polo-st740')) {
    if (hasHeadwear && clientPrice === 40) {
      return AUTHORITATIVE_CATALOG['men-polo-st740-upsell'];
    }
    return AUTHORITATIVE_CATALOG['men-polo-st740'];
  }

  if (AUTHORITATIVE_CATALOG[cleanId]) {
    return AUTHORITATIVE_CATALOG[cleanId];
  }
  if (cleanId.startsWith('women-polo-lst740')) return AUTHORITATIVE_CATALOG['women-polo-lst740'];
  if (cleanId.startsWith('men-polo-k830')) return AUTHORITATIVE_CATALOG['men-polo-k830'];
  if (cleanId.startsWith('women-polo-lk830')) return AUTHORITATIVE_CATALOG['women-polo-lk830'];
  if (cleanId.startsWith('outerwear-f218-fleece')) return AUTHORITATIVE_CATALOG['outerwear-f218-fleece'];
  if (cleanId.startsWith('outerwear-st443')) return AUTHORITATIVE_CATALOG['outerwear-st443'];
  if (cleanId.startsWith('bundle-foursome-01')) return AUTHORITATIVE_CATALOG['bundle-foursome-01'];
  return null;
}

const PAIR_DISCOUNT_CENTS_PER_POLO = 500;

function isPairEligibleCatalogEntry(entry: CatalogEntry): boolean {
  return (
    entry === AUTHORITATIVE_CATALOG['men-polo-st740'] ||
    entry === AUTHORITATIVE_CATALOG['women-polo-lst740'] ||
    entry === AUTHORITATIVE_CATALOG['men-polo-k830'] ||
    entry === AUTHORITATIVE_CATALOG['women-polo-lk830']
  );
}

const SILHOUETTE_BLUEPRINTS: Record<string, number> = {
  'men-polo-st740': 1984,
  'women-polo-lst740': 3322,
  'men-polo-k830': 2038,
  'women-polo-lk830': 2026,
  'outerwear-f218-fleece': 3630,
  'outerwear-st443': 3630,
  'headwear-flexfit-mesh': 5272,
  'bundle-foursome-01': 1984,
};

const SILHOUETTE_PREFIX_LIST = [
  'women-polo-lst740',
  'men-polo-st740',
  'women-polo-lk830',
  'men-polo-k830',
  'outerwear-f218-fleece',
  'outerwear-st443',
  'headwear-flexfit-mesh',
  'bundle-foursome-01',
];

const PRINTIFY_COLOR_ALIASES: Record<string, string> = {
  'deep midnight navy': 'True Navy',
  'true navy': 'True Navy',
  'carolina blue': 'Carolina Blue',
  'crisp white': 'White',
  'pure white': 'White',
  'white': 'White',
  'onyx black': 'Black',
  'black': 'Black',
  'forest green': 'Forest Green',
  'deep red': 'Deep Red',
  'true red': 'True Red',
  'graphite': 'Graphite',
  'grey concrete': 'Grey Concrete',
  'true royal': 'True Royal',
  'iron grey': 'Iron Grey',
  'charcoal grey heather': 'Grey Heather',
  'grey heather': 'Grey Heather',
  'magnet slate': 'Magnet',
  'magnet': 'Magnet',
  'aegean blue heather': 'Aegean Blue Heather',
  'black heather': 'Black Heather',
  'charcoal heather': 'Charcoal Heather',
  'dark teal heather': 'Dark Teal Heather',
  'river blue navy heather': 'River Blue Navy Heather',
};

function normalizeSizeAliases(size: string): string[] {
  const upper = size.trim().toUpperCase();
  if (upper === '2XL' || upper === 'XXL') return ['2XL', 'XXL'];
  if (upper === '3XL' || upper === 'XXXL') return ['3XL', 'XXXL'];
  return [upper];
}

function inferLogoStyle(rawStyle?: string, colorMeta?: string): 'mark_only' | 'mark_text' | 'mark_monogram' {
  if (rawStyle === 'mark_only' || rawStyle === 'mark_text' || rawStyle === 'mark_monogram') {
    return rawStyle;
  }
  const lower = (colorMeta || '').toLowerCase();
  if (lower.includes('mark-only') || lower.includes('mark only')) return 'mark_only';
  if (lower.includes('wordmark') || lower.includes('mark + text')) return 'mark_text';
  return 'mark_monogram';
}

function findServerLedgerProduct(
  silhouetteId: string,
  logoStyle: 'mark_only' | 'mark_text' | 'mark_monogram'
): ServerLedgerProduct {
  const products = Object.values(SERVER_PRINTIFY_LEDGER);
  if (silhouetteId === 'headwear-flexfit-mesh') {
    return products.find(p => p.blueprintId === 5272) || products[0];
  }
  const targetBlueprint = SILHOUETTE_BLUEPRINTS[silhouetteId] || 1984;
  const candidates = products.filter(p => p.blueprintId === targetBlueprint);
  const match = candidates.find(p => {
    const t = p.title.toLowerCase();
    if (logoStyle === 'mark_only') return t.includes('mark-only') || t.includes('mark only');
    if (logoStyle === 'mark_text') return t.includes('wordmark');
    return t.includes('monogram');
  });
  return match || candidates[0] || products[0];
}

function resolveSingleServerItem(
  silhouetteId: string,
  colorName: string,
  size: string,
  logoStyle: 'mark_only' | 'mark_text' | 'mark_monogram',
  quantity: number
): PrintifyLineItemSpec {
  const product = findServerLedgerProduct(silhouetteId, logoStyle);
  const cleanColorLower = colorName.split('•')[0].trim().toLowerCase();
  const targetPrintifyColor =
    PRINTIFY_COLOR_ALIASES[cleanColorLower] || colorName.split('•')[0].trim() || 'True Navy';
  const targetColorLower = targetPrintifyColor.toLowerCase();
  const validSizes = normalizeSizeAliases(
    size || (silhouetteId === 'headwear-flexfit-mesh' ? 'S/M' : 'L')
  );

  const entries = Object.entries(product.variants);
  let matched = entries.find(([title]) => {
    const parts = title.split(/\s+\/\s+/).map(s => s.trim());
    const hasColor = parts.some(p => p.toLowerCase() === targetColorLower);
    const hasSize = parts.some(p => validSizes.includes(p.toUpperCase()));
    return hasColor && hasSize;
  });

  if (!matched) {
    matched = entries.find(([title]) => title.toLowerCase().includes(targetColorLower));
  }
  if (!matched) {
    matched = entries[0];
  }

  return {
    product_id: product.id,
    variant_id: matched ? matched[1] : 122461,
    quantity,
  };
}

export function mergePrintifyLineItems(items: PrintifyLineItemSpec[]): PrintifyLineItemSpec[] {
  const merged = new Map<string, PrintifyLineItemSpec>();
  for (const item of items) {
    if (!item.product_id || !Number.isFinite(Number(item.variant_id))) continue;
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const variantId = Number(item.variant_id);
    const key = `${item.product_id}:${variantId}`;
    const existing = merged.get(key);
    if (existing) {
      existing.quantity += qty;
    } else {
      merged.set(key, { product_id: item.product_id, variant_id: variantId, quantity: qty });
    }
  }
  return Array.from(merged.values());
}

export function resolveServerFulfillmentItems(input: {
  id: string;
  color?: string;
  size?: string;
  logoStyle?: string;
  userTypeLabel?: string;
  quantity?: number;
}): PrintifyLineItemSpec[] {
  const rawId = String(input.id || '').trim();
  const silhouetteId =
    SILHOUETTE_PREFIX_LIST.find(prefix => rawId.startsWith(prefix)) || 'men-polo-st740';
  const logoStyle = inferLogoStyle(input.logoStyle, input.color);
  const qty = Math.max(1, Math.min(20, Math.floor(Number(input.quantity) || 1)));
  const cleanSize = String(
    input.size || (silhouetteId === 'headwear-flexfit-mesh' ? 'S/M' : 'L')
  ).trim();
  const colorMeta = String(input.color || '');
  const baseColor = colorMeta.split('•')[0].trim();

  if (silhouetteId === 'bundle-foursome-01') {
    const colorLower = baseColor.toLowerCase();
    let colors: [string, string, string, string] = [
      'Deep Midnight Navy',
      'Carolina Blue',
      'Crisp White',
      'Onyx Black',
    ];
    if (colorLower.includes('navy')) {
      colors = ['Deep Midnight Navy', 'Deep Midnight Navy', 'Deep Midnight Navy', 'Deep Midnight Navy'];
    } else if (colorLower.includes('carolina')) {
      colors = ['Carolina Blue', 'Carolina Blue', 'Carolina Blue', 'Carolina Blue'];
    } else if (colorLower.includes('white')) {
      colors = ['Crisp White', 'Crisp White', 'Crisp White', 'Crisp White'];
    }

    const cutHint = `${input.userTypeLabel || ''} ${colorMeta}`.toLowerCase();
    let cuts: [string, string, string, string] = [
      'men-polo-st740',
      'men-polo-st740',
      'men-polo-st740',
      'men-polo-st740',
    ];
    if (cutHint.includes("2 men's + 2 women's") || cutHint.includes('2m-2w')) {
      cuts = ['men-polo-st740', 'men-polo-st740', 'women-polo-lst740', 'women-polo-lst740'];
    } else if (cutHint.includes("3 men's + 1 women's") || cutHint.includes('3m-1w')) {
      cuts = ['men-polo-st740', 'men-polo-st740', 'men-polo-st740', 'women-polo-lst740'];
    } else if (cutHint.includes("4 women's") || cutHint.includes('4-womens')) {
      cuts = ['women-polo-lst740', 'women-polo-lst740', 'women-polo-lst740', 'women-polo-lst740'];
    }

    const expanded = [0, 1, 2, 3].map(idx =>
      resolveSingleServerItem(cuts[idx], colors[idx], cleanSize, logoStyle, qty)
    );
    return mergePrintifyLineItems(expanded);
  }

  return [resolveSingleServerItem(silhouetteId, baseColor, cleanSize, logoStyle, qty)];
}

function resolveLegacyLineItemDescription(description: string, quantity: number): PrintifyLineItemSpec[] {
  const lower = description.toLowerCase();
  let id = 'men-polo-st740';
  if (lower.includes('clubhouse') && lower.includes('women')) id = 'women-polo-lk830';
  else if (lower.includes('clubhouse') && (lower.includes('fleece') || lower.includes('1/4-zip'))) id = 'outerwear-f218-fleece';
  else if (lower.includes('clubhouse')) id = 'men-polo-k830';
  else if (lower.includes('women')) id = 'women-polo-lst740';
  else if (lower.includes('cap') || lower.includes('mesh')) id = 'headwear-flexfit-mesh';
  else if (lower.includes('foursome') || lower.includes('scramble')) id = 'bundle-foursome-01';
  else if (lower.includes('quarter-zip') || lower.includes('pullover')) id = 'outerwear-f218-fleece';

  const parenMatch = description.match(/\(([^,]+),\s*Size\s+([^)]+)\)/i);
  const color = parenMatch?.[1]?.trim() || 'Deep Midnight Navy';
  const size = parenMatch?.[2]?.trim() || (id === 'headwear-flexfit-mesh' ? 'S/M' : 'L');
  return resolveServerFulfillmentItems({ id, color, size, quantity });
}

function sanitizeText(val: unknown, maxLen = 64): string {
  return String(val || '')
    .replace(/[<>'"&]/g, '')
    .trim()
    .slice(0, maxLen);
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || 'Golfer';
  const lastName = parts.slice(1).join(' ') || 'Member';
  return { firstName, lastName };
}

function verifyStripeWebhookSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  if (!rawBody || !signatureHeader || !secret) return false;
  const parts = signatureHeader.split(',').map(p => p.trim());
  const tsPart = parts.find(p => p.startsWith('t='))?.slice(2);
  const v1Sigs = parts.filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  if (!tsPart || v1Sigs.length === 0) return false;

  const timestamp = Number(tsPart);
  if (!Number.isFinite(timestamp) || Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300) {
    return false;
  }

  const expectedHex = createHmac('sha256', secret).update(`${tsPart}.${rawBody}`).digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  return v1Sigs.some(sig => {
    try {
      const sigBuf = Buffer.from(sig, 'hex');
      return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
    } catch {
      return false;
    }
  });
}

function getHeader(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const lower = name.toLowerCase();
  const val = headers[lower] ?? headers[name];
  return Array.isArray(val) ? val[0] : val;
}

export function createStripeGatewayHandler(deps: StripeGatewayDeps = {}) {
  const inFlightFulfillments = new Map<
    string,
    Promise<{ statusCode: number; body: Record<string, unknown> }>
  >();

  return async function handler(req: ApiRequest, res: ApiResponse) {
    const STRIPE_SECRET_KEY =
      deps.stripeSecretKey ??
      (process.env.STRIPE_SECRET_KEY ||
        process.env.STRIPE_API_KEY ||
        process.env.STRIPE_RESTRICTED_KEY ||
        process.env.STRIPE_KEY ||
        '');
    const STRIPE_WEBHOOK_SECRET = deps.stripeWebhookSecret ?? (process.env.STRIPE_WEBHOOK_SECRET || '');
    const PRINTIFY_API_TOKEN = deps.printifyApiToken ?? (process.env.PRINTIFY_API_TOKEN || '');
    const PRINTIFY_SHOP_ID = deps.printifyShopId ?? (process.env.PRINTIFY_SHOP_ID || '29111523');
    const fetchFn = deps.fetchImpl ?? fetch;

    const requestOrigin = getHeader(req.headers, 'origin');
    const corsOrigin = isAllowedOrigin(requestOrigin) ? requestOrigin! : 'https://www.highdrawgear.com';

    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawAction = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;
    const action = rawAction || 'checkout';

    async function fulfillSessionById(
      sessionId: string,
      requestedOrderId?: string
    ): Promise<{ statusCode: number; body: Record<string, unknown> }> {
      if (!STRIPE_SECRET_KEY) {
        return { statusCode: 503, body: { fulfilled: false, error: 'Payment gateway configuration missing.' } };
      }
      if (!PRINTIFY_API_TOKEN) {
        return { statusCode: 503, body: { fulfilled: false, error: 'Fulfillment gateway configuration pending.' } };
      }

      const stripeRes = await fetchFn(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(
          sessionId
        )}?expand[]=line_items&expand[]=line_items.data.price.product`,
        {
          headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
        }
      );

      if (!stripeRes.ok) {
        return {
          statusCode: stripeRes.status === 404 ? 404 : 502,
          body: { fulfilled: false, error: 'Unable to verify Stripe Checkout session.' },
        };
      }

      const session = (await stripeRes.json()) as Record<string, any>;
      if (session.payment_status !== 'paid') {
        return {
          statusCode: 402,
          body: {
            fulfilled: false,
            error: 'Payment has not been completed for this session.',
            paymentStatus: session.payment_status,
          },
        };
      }

      const resolvedOrderId = sanitizeText(
        requestedOrderId || session.metadata?.orderId || `HD-${Date.now()}`,
        32
      ).replace(/[^a-zA-Z0-9-_]/g, '');

      const shipping =
        session.collected_information?.shipping_details ||
        session.shipping_details ||
        session.customer_details ||
        {};
      const customerDetails = session.customer_details || {};
      const addr = shipping.address || customerDetails.address || {};
      const recipientName = String(
        shipping.name ||
          session.collected_information?.individual_name ||
          customerDetails.name ||
          'Golfer Member'
      );
      const { firstName, lastName } = splitFullName(recipientName);
      const recipientEmail = String(
        customerDetails.email || session.customer_email || 'orders@highdrawgear.com'
      ).trim();
      const city = String(addr.city || '').trim();
      const region = String(addr.state || '').trim().toUpperCase();
      const shipSummary = [city, region].filter(Boolean).join(', ');

      // Idempotency Check against Printify shop orders
      const ordersRes = await fetchFn(
        `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
            'User-Agent': 'HighDrawGolf-Backend/2.0',
          },
        }
      );

      if (ordersRes.ok) {
        const ordersData = (await ordersRes.json()) as { data?: Array<Record<string, any>> };
        const existing = (ordersData.data || []).find(o => {
          const shopOrderId = o?.metadata?.shop_order_id;
          const shopOrderLabel = o?.metadata?.shop_order_label;
          return (
            shopOrderId === session.id ||
            (Boolean(resolvedOrderId) &&
              (shopOrderId === resolvedOrderId || shopOrderLabel === resolvedOrderId))
          );
        });
        if (existing) {
          return {
            statusCode: 200,
            body: {
              fulfilled: true,
              alreadyFulfilled: true,
              orderId: resolvedOrderId,
              printifyOrderId: existing.id,
              printifyStatus: existing.status,
              recipientFirstName: firstName,
              shipSummary,
              amountTotalDollars: Number(session.amount_total || 0) / 100,
            },
          };
        }
      }

      const rawLineItems: Array<Record<string, any>> = Array.isArray(session.line_items?.data)
        ? session.line_items.data
        : [];
      const printifySpecs: PrintifyLineItemSpec[] = [];

      for (const li of rawLineItems) {
        const productMeta =
          typeof li?.price?.product === 'object' && li.price.product !== null
            ? li.price.product.metadata || {}
            : {};
        const description = String(li?.description || '');
        if (
          productMeta.fulfillment_type === 'shipping' ||
          description.toLowerCase().includes('standard domestic fairway shipping')
        ) {
          continue;
        }

        const lineQty = Math.max(1, Math.floor(Number(li?.quantity) || 1));
        let parsedUnitItems: PrintifyLineItemSpec[] | null = null;
        if (
          typeof productMeta.unit_fulfillment_items === 'string' &&
          productMeta.unit_fulfillment_items
        ) {
          try {
            const candidate = JSON.parse(productMeta.unit_fulfillment_items);
            if (Array.isArray(candidate) && candidate.length > 0) {
              parsedUnitItems = candidate.map((u: Record<string, any>) => ({
                product_id: String(u.product_id || ''),
                variant_id: Number(u.variant_id),
                quantity: Math.max(1, Math.floor(Number(u.quantity) || 1)) * lineQty,
              }));
            }
          } catch {
            parsedUnitItems = null;
          }
        }

        if (parsedUnitItems) {
          printifySpecs.push(...parsedUnitItems);
        } else {
          printifySpecs.push(...resolveLegacyLineItemDescription(description, lineQty));
        }
      }

      const finalLineItems = mergePrintifyLineItems(printifySpecs);
      if (finalLineItems.length === 0) {
        return {
          statusCode: 400,
          body: { fulfilled: false, error: 'No fulfillable garments found in Stripe session.' },
        };
      }

      const printifyPayload = {
        external_id: session.id,
        label: resolvedOrderId,
        line_items: finalLineItems,
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: firstName,
          last_name: lastName,
          email: recipientEmail,
          phone: String(customerDetails.phone || '').trim(),
          country: String(addr.country || 'US').trim().toUpperCase(),
          region,
          address1: String(addr.line1 || '').trim(),
          address2: String(addr.line2 || '').trim(),
          city,
          zip: String(addr.postal_code || '').trim(),
        },
      };

      const createRes = await fetchFn(
        `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
            'User-Agent': 'HighDrawGolf-Backend/2.0',
          },
          body: JSON.stringify(printifyPayload),
        }
      );

      if (!createRes.ok) {
        return {
          statusCode: 502,
          body: {
            fulfilled: false,
            error: 'Printify order dispatch failed.',
            upstreamStatus: createRes.status,
          },
        };
      }

      const createdOrder = (await createRes.json()) as Record<string, any>;
      return {
        statusCode: 200,
        body: {
          fulfilled: true,
          alreadyFulfilled: false,
          orderId: resolvedOrderId,
          printifyOrderId: createdOrder.id,
          printifyStatus: createdOrder.status || 'pending',
          recipientFirstName: firstName,
          shipSummary,
          amountTotalDollars: Number(session.amount_total || 0) / 100,
        },
      };
    }

    async function runFulfillmentOnce(sessionId: string, requestedOrderId?: string) {
      const existingPromise = inFlightFulfillments.get(sessionId);
      if (existingPromise) return existingPromise;

      const promise = fulfillSessionById(sessionId, requestedOrderId).finally(() => {
        inFlightFulfillments.delete(sessionId);
      });
      inFlightFulfillments.set(sessionId, promise);
      return promise;
    }

    try {
      if (action === 'checkout') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, any>;
        const { items, customerEmail, orderId, returnUrl, attribution } = body;

        if (!Array.isArray(items) || items.length === 0 || items.length > 25) {
          return res.status(400).json({ error: 'Invalid cart items payload.' });
        }

        if (!STRIPE_SECRET_KEY) {
          return res.status(503).json({
            configured: false,
            error: 'Payment gateway is temporarily offline.',
          });
        }

        const safeOrigin = isAllowedOrigin(typeof returnUrl === 'string' ? returnUrl : undefined)
          ? String(returnUrl)
          : 'https://www.highdrawgear.com';
        const safeOrderId = sanitizeText(orderId || `HD-${Date.now()}`, 32).replace(
          /[^a-zA-Z0-9-_]/g,
          ''
        );

        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('allow_promotion_codes', 'true');

        if (customerEmail && typeof customerEmail === 'string') {
          const cleanEmail = customerEmail.trim().slice(0, 120);
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            params.append('customer_email', cleanEmail);
          }
        }

        params.append(
          'success_url',
          `${safeOrigin}/?payment=success&orderId=${encodeURIComponent(
            safeOrderId
          )}&session_id={CHECKOUT_SESSION_ID}`
        );
        params.append('cancel_url', `${safeOrigin}/?payment=cancelled`);
        params.append('shipping_address_collection[allowed_countries][0]', 'US');
        params.append('shipping_address_collection[allowed_countries][1]', 'CA');

        let eligiblePoloUnits = 0;
        const resolvedCartEntries = [];
        for (const rawItem of items) {
          const catalogProduct = resolveCatalogItem(
            String(rawItem?.id || ''),
            Number(rawItem?.price),
            items
          );
          if (!catalogProduct) {
            return res
              .status(400)
              .json({ error: `Unrecognized product SKU: ${sanitizeText(rawItem?.id, 32)}` });
          }
          const qty = Math.max(1, Math.min(20, Math.floor(Number(rawItem?.quantity) || 1)));
          const pairEligible = isPairEligibleCatalogEntry(catalogProduct);
          if (pairEligible) {
            eligiblePoloUnits += qty;
          }
          resolvedCartEntries.push({ rawItem, catalogProduct, qty, pairEligible });
        }

        const pairDiscountActive = eligiblePoloUnits >= 2;
        let lineItemIndex = 0;
        let subtotalCents = 0;

        for (const entry of resolvedCartEntries) {
          const { rawItem, catalogProduct, qty, pairEligible } = entry;
          const safeColor = sanitizeText(rawItem?.color || 'Standard', 96);
          const safeSize = sanitizeText(rawItem?.size || 'L', 16);
          const unitFulfillment = resolveServerFulfillmentItems({
            id: String(rawItem?.id || ''),
            color: String(rawItem?.color || ''),
            size: String(rawItem?.size || 'L'),
            logoStyle: typeof rawItem?.logoStyle === 'string' ? rawItem.logoStyle : undefined,
            userTypeLabel:
              typeof rawItem?.userTypeLabel === 'string' ? rawItem.userTypeLabel : undefined,
            quantity: 1,
          });

          const unitAmountCents =
            pairDiscountActive && pairEligible
              ? Math.max(100, catalogProduct.unitAmountCents - PAIR_DISCOUNT_CENTS_PER_POLO)
              : catalogProduct.unitAmountCents;
          const pairSuffix = pairDiscountActive && pairEligible ? ' — 2+ Polo Pair (-$5)' : '';

          subtotalCents += unitAmountCents * qty;

          params.append(`line_items[${lineItemIndex}][price_data][currency]`, 'usd');
          params.append(
            `line_items[${lineItemIndex}][price_data][product_data][name]`,
            `${catalogProduct.name} (${safeColor}, Size ${safeSize})${pairSuffix}`
          );
          params.append(
            `line_items[${lineItemIndex}][price_data][product_data][metadata][fulfillment_type]`,
            'printify'
          );
          params.append(
            `line_items[${lineItemIndex}][price_data][product_data][metadata][unit_fulfillment_items]`,
            JSON.stringify(unitFulfillment)
          );
          params.append(
            `line_items[${lineItemIndex}][price_data][unit_amount]`,
            unitAmountCents.toString()
          );
          params.append(`line_items[${lineItemIndex}][quantity]`, qty.toString());
          lineItemIndex++;
        }

        if (subtotalCents > 0 && subtotalCents < 7500) {
          params.append(`line_items[${lineItemIndex}][price_data][currency]`, 'usd');
          params.append(
            `line_items[${lineItemIndex}][price_data][product_data][name]`,
            'Standard Domestic Fairway Shipping (Free Over $75)'
          );
          params.append(
            `line_items[${lineItemIndex}][price_data][product_data][metadata][fulfillment_type]`,
            'shipping'
          );
          params.append(`line_items[${lineItemIndex}][price_data][unit_amount]`, '800');
          params.append(`line_items[${lineItemIndex}][quantity]`, '1');
        }

        params.append('metadata[orderId]', safeOrderId);
        params.append('metadata[fulfillment]', 'printify_auto');
        params.append('metadata[securityVersion]', 'v3-printify-bridge');
        params.append('metadata[pairDiscountApplied]', pairDiscountActive ? 'true' : 'false');
        params.append('metadata[pairEligibleUnits]', String(eligiblePoloUnits));

        if (attribution && typeof attribution === 'object') {
          const attr = attribution as Record<string, unknown>;
          const attrFields: Array<[string, unknown]> = [
            ['utm_source', attr.utm_source],
            ['utm_medium', attr.utm_medium],
            ['utm_campaign', attr.utm_campaign],
            ['utm_content', attr.utm_content],
            ['ref_code', attr.ref_code],
            ['landing_path', attr.landing_path],
          ];
          for (const [key, rawVal] of attrFields) {
            const cleanVal = sanitizeText(rawVal, 120);
            if (cleanVal) {
              params.append(`metadata[${key}]`, cleanVal);
            }
          }
        }

        const response = await fetchFn('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data = (await response.json()) as Record<string, any>;
        if (!response.ok) {
          return res.status(response.status).json({
            error: 'Unable to initialize checkout session. Please verify your cart and try again.',
            stripeErrorCode: data.error?.code,
          });
        }

        return res.status(200).json({
          configured: true,
          sessionId: data.id,
          checkoutUrl: data.url,
        });
      }

      if (action === 'fulfill-session') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, any>;
        const rawQuerySession = Array.isArray(req.query?.sessionId)
          ? req.query.sessionId[0]
          : req.query?.sessionId;
        const sessionId = String(body.sessionId || rawQuerySession || '').trim();
        const requestedOrderId = typeof body.orderId === 'string' ? body.orderId : undefined;

        if (!/^cs_(live|test)_[a-zA-Z0-9_]+$/.test(sessionId)) {
          return res
            .status(400)
            .json({ fulfilled: false, error: 'Invalid Stripe Checkout session identifier.' });
        }

        const result = await runFulfillmentOnce(sessionId, requestedOrderId);
        return res.status(result.statusCode).json(result.body);
      }

      if (action === 'webhook') {
        if (!STRIPE_WEBHOOK_SECRET) {
          return res
            .status(503)
            .json({ received: false, error: 'Stripe webhook secret is not configured.' });
        }
        const sigHeader = getHeader(req.headers, 'stripe-signature') || '';
        const rawBody =
          typeof req.body === 'string'
            ? req.body
            : Buffer.isBuffer(req.body)
            ? (req.body as Buffer).toString('utf8')
            : JSON.stringify(req.body ?? {});

        if (!verifyStripeWebhookSignature(rawBody, sigHeader, STRIPE_WEBHOOK_SECRET)) {
          return res
            .status(400)
            .json({ received: false, error: 'Invalid Stripe webhook signature.' });
        }

        const event = JSON.parse(rawBody) as {
          type?: string;
          data?: { object?: { id?: string; metadata?: { orderId?: string } } };
        };
        if (event.type === 'checkout.session.completed') {
          const completedSessionId = String(event.data?.object?.id || '').trim();
          if (!/^cs_(live|test)_[a-zA-Z0-9_]+$/.test(completedSessionId)) {
            return res
              .status(400)
              .json({ received: false, error: 'Webhook missing valid session ID.' });
          }
          const result = await runFulfillmentOnce(
            completedSessionId,
            event.data?.object?.metadata?.orderId
          );
          return res.status(result.statusCode).json({ received: true, ...result.body });
        }

        return res.status(200).json({ received: true, ignored: true, type: event.type });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
      console.error(
        'Stripe handler exception:',
        err instanceof Error ? err.message : 'Unknown error'
      );
      return res.status(500).json({ error: 'Internal server error in Stripe gateway' });
    }
  };
}

export default createStripeGatewayHandler();
