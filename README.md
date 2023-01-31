# Metamask-Snaps
## Schema
### Users
```js
[
  {
    public_address : string,
    contacts : [
      {
        name : string,
        address : string
      }
    ],
    balances : [
      {
        address : string,
        owedBalance : float
      }
    ],
    groups : [
      {
        group_id : reference,
        balancesOwed : float
      }
    ],
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
    members : [
      {
        user : reference,
        owedBalance : float
      }
    ],
    splits : [
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
