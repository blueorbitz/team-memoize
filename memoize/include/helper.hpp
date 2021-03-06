
string clean_plate_number(string plate_number) {
  // trim all the space
  plate_number.erase(remove(plate_number.begin(), plate_number.end(), ' '), plate_number.end());
  // convert lower case
  transform(plate_number.begin(), plate_number.end(), plate_number.begin(), ::tolower);

  return plate_number;
}
