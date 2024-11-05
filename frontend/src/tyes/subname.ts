export interface SubnameText {
    key: string
    value: string
  }
  
  export interface SubnameAddress {
    coin: number
    value: string
  }
  
  export interface CreateSubnameDTO {
    parentName: string
    label: string
    contenthash?: string
    subscriptionPackId: string
    texts: SubnameText[]
    addresses: SubnameAddress[]
  }
  
  export interface UpdateSubnameDTO {
    contenthash?: string
    texts?: SubnameText[]
    addresses?: SubnameAddress[]
  }
  
  export interface CreateSubscriptionPackDTO {
    name: string
    price: number
    duration: number
    maxSubnames: number
  }