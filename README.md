# Metamask-Snaps
## Schema
### Users
```js
[
  {
    address : string,
    contacts<array> : [
      {
        name : string,
        address : string
      }
    ],
    balances<array> : [
      {
        address : string,
        owedBalance : float
      }
    ],
    groups<Hashmap> : {
      groupId: balanceOwed
    },
    recurring_payments : [
      {
        _id : id,
        name : string,
        to : string,
        amount : float,
        billDate : timestamp,
        activeStatus : boolean
      }
    ]
  }
]
```

### Groups
```js
[
  {
    _id : id,
    name : string,
    type : (group, personal),
    members<Hashmap> : {
      user: owedBalance
    },
    splits<collection> : [
      {
        _id : id,
        date : timestamp,
        name : string,
        involved : [
          {
            user : reference,
            amount : float
          }
        ],
        chat : [
          {
            _id : id,
            date : timestamp,
            message : string
          }
        ]
      }
    ]
  }
]
```
