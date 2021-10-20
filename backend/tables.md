# Tables for hosting the game database

Table categories
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| id       | int         | NO   | PRI | NULL    | auto_increment |
| category | varchar(30) | NO   |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+


Table questions
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| year     | int          | NO   |     | NULL    |                |
| title    | varchar(100) | YES  |     | NULL    |                |
| category | int          | NO   | MUL | NULL    |                |
+----------+--------------+------+-----+---------+----------------+

