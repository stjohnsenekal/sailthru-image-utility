# README #

The process of this image utility is to consume from the integration service the original image, and produce an image potentially with a savings badge or pill or both. This is produced into the assets folder, uploaded to our gcp/cdn bucket, and then deleted.


They would have been sent something like 
http://cdn.onedayonly.co.za/mailers/2020/44312314.email_240x240.jpg

Sailthru integraiton service is going to send the following:

1. the original url (eg https://cdni.onedayonly.co.za/catalog/product/160/190/1601908762.7076.jpeg?h=240&w=240)
2. product_id.type.jpg (eg 44312314.email_240x240.jpg)
3. the savings string ("SAVE 50%")
4. the pill string ("MORE OPTIONS")

which is effectly one request per image change - and the integration service rather than the image utility controls that business logic.

TODO: 
Think about corner cases
-------------
No savings
No pill
Neither


REDIS
-------------
localhost and current
SUBSCRIPTIONS=["image-request"]
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

prod
SUBSCRIPTIONS=["image-request"]
REDIS_HOST="odo-ops01.jnb1.host-chs.net"
REDIS_PORT=6379
