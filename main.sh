export PGPASSWORD=password;
cd ddl-scripts;
for file in $(ls); do
	psql -h localhost -U postgres -d postgres -a -f $file 
done