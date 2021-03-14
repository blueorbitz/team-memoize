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

  auto vec_idx = _vehicle.get_index<name("user")>();
  auto vec_itr = vec_idx.find(from.value);

  // check existing plate_number
  bool has_plate_number = false;
  for(; vec_itr != vec_idx.end() && vec_itr->user == from; vec_itr++) {
    if(vec_itr->plate_number == plate_number) {
      has_plate_number = true;
      break;
    }
  }
  check(has_plate_number == true, "plate_number not found");

  // delete plate_number
  auto del_itr = _vehicle.find(vec_itr->id);
  check(del_itr != _vehicle.end(), "id not found");

  print_f("delete plate_number: {%, %, %}", vec_itr->id, vec_itr->user, vec_itr->plate_number);
  _vehicle.erase(del_itr);

  // check existing plate_number
  auto svc_idx = _service.get_index<name("vehicle")>();
  auto vehicle_id = vec_itr->id;
  auto svc_itr = svc_idx.find(vehicle_id);
  while(svc_itr != svc_idx.end() && svc_itr->vehicle_id == vehicle_id) {
    svc_itr = svc_idx.erase(svc_itr);
  }

}

ACTION memoize::updvehicle(name from, uint64_t id, string chasis_sn, time_point manufacture_date, time_point ownership_date) {
  require_auth(from);

  auto itr = _vehicle.find(id);

  // ensure id that is being modified is valid
  check(itr != _vehicle.end(), "Invalid id");
  check(itr->user == from, "Invalid id");

  // check chasis_sn within text limit
  check(chasis_sn.length() < 64, "chasis_sn too long");

  _vehicle.modify(itr, _self, [&](auto& row) {
    row.chasis_sn = chasis_sn;
    row.manufacture_date = manufacture_date;
    row.ownership_date = ownership_date;
   });
}

ACTION memoize::addservice(name from, uint64_t vehicle_id, time_point service_date, string memo) {
  require_auth(from);

  // check if vehicle_id is valid
  auto itr = _vehicle.find(vehicle_id);
  check(itr != _vehicle.end(), "Invalid id");
  check(itr->user == from, "Invalid id");

  // insert new plate_number
  _service.emplace(from, [&](auto &data) {
    data.id = _service.available_primary_key();
    data.vehicle_id = vehicle_id;
    data.service_date = service_date;
    data.memo = memo;
    data.is_delete = false;
  });
}

ACTION memoize::delservice(name from, uint64_t id) {
  require_auth(from);

  // ensure id that is being modified is valid
  auto itr = _service.find(id);
  check(itr != _service.end(), "Invalid id");

  auto vec_itr = _vehicle.find(itr->vehicle_id);
  check(vec_itr != _vehicle.end(), "Invalid id");
  check(vec_itr->user == from, "Invalid id");

  _service.modify(itr, _self, [&](auto& row) {
    row.is_delete = true;
  });
}

EOSIO_DISPATCH(memoize, (hi)(clear)(addplate)(delplate)(updvechicle)(addservice)(delservice))
