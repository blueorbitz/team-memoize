#include <memoize.hpp>
#include <helper.hpp>

#define DELETE_ALL(_table) { \
  auto itr = _table.begin(); \
  while (itr != _table.end()) \
    itr = _table.erase(itr); \
}

ACTION memoize::hi(name from, string message) {
  require_auth(from);

  // Find the record from _messages table
  auto msg_itr = _messages.find(from.value);
  if (msg_itr == _messages.end()) {
    // Create a message record if it does not exist
    _messages.emplace(from, [&](auto& msg) {
      msg.id = _messages.available_primary_key();
      msg.user = from;
      msg.text = message;
    });
  } else {
    // Modify a message record if it exists
    _messages.modify(msg_itr, from, [&](auto& msg) {
      msg.text = message;
    });
  }
}

ACTION memoize::clear() {
  require_auth(get_self());

  // Delete all records in table
  DELETE_ALL(_messages);
  DELETE_ALL(_vehicle);
}

ACTION memoize::addplate(name from, string plate_number) {
  require_auth(from);

  // check plate_number within text limit
  plate_number = clean_plate_number(plate_number);
  check(plate_number.length() < 12, "plate_number too long");

  // check existing plate_number
  auto idx = _vehicle.get_index<name("user")>();
  for(auto itr = idx.find(from.value); itr != idx.end() && itr->user == from; itr++) {
    // print_f("idx: {%, %, %}\n", itr->id, itr->user, itr->plate_number);
    check(itr->plate_number != plate_number, "plate_number exist");
  }

  // insert new plate_number
  _vehicle.emplace(from, [&](auto &data) {
    data.id = _vehicle.available_primary_key();
    data.user = from;
    data.plate_number = plate_number;
  });
}

ACTION memoize::delplate(name from, string plate_number) {
  require_auth(from);
  
  // check plate_number within text limit
  plate_number = clean_plate_number(plate_number);
  check(plate_number.length() < 12, "plate_number too long");

  auto idx = _vehicle.get_index<name("user")>();
  auto itr = idx.find(from.value);

  // check existing plate_number
  bool has_plate_number = false;
  for(; itr != idx.end() && itr->user == from; itr++) {
    if(itr->plate_number == plate_number) {
      has_plate_number = true;
      break;
    }
  }
  check(has_plate_number == true, "plate_number not found");

  // delete plate_number
  auto del_itr = _vehicle.find(itr->id);
  check(del_itr != _vehicle.end(), "id not found");

  print_f("delete plate_number: {%, %, %}", itr->id, itr->user, itr->plate_number);
  _vehicle.erase(del_itr);
}
