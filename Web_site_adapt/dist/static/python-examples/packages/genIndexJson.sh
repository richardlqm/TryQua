# generate a json with the files under the current directory which end with whl and contain no numpy in the name
# the json is used by the python examples to download the packages

cd "$(dirname "$0")"
output="pckgindex.json"

files=$(ls *.whl | grep -v numpy)
num_files=$(echo "$files" | wc -l)

echo "[" > "$output"
count=1

for file in $files; do
    if [ $count -ne $num_files ]; then
        echo "  \"$file\"," >> "$output"
    else
        echo "  \"$file\"" >> "$output"
    fi
    ((count++))
done

echo "]" >> "$output"
