#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT memoize : public contract {
  public:
    using contract::contract;

    memoize(name receiver, name code, datastream<const char*> ds ) :
      contract(receiver, code, ds),
      _messages(receiver, receiver.value),
      _vehicle(receiver, receiver.value)
      {}

    ACTION hi(name from, string message);
    ACTION clear();

    ACTION addplate(name from, string plate_number);
    ACTION delplate(name from, string plate_number);
    
  private:
    TABLE messages {
      uint64_t id;
      name    user;
      string  text;
      
      auto primary_key() const { return user.value; }
    };
    typedef multi_index<name("messages"), messages> messages_table;
    messages_table _messages;

    TABLE vehicle {
      uint64_t  id;
      name      user;
      string    plate_number;
      string    chasis_sn;
      time_point  manufacture_date;
      time_point  ownership_date;

      uint64_t primary_key() const { return id; }
      uint64_t by_secondary() const { return user.value; }
    };
    typedef multi_index<
      name("vehicle"), vehicle, indexed_by<
        name("user"), const_mem_fun<
          vehicle, uint64_t, &vehicle::by_secondary
        >
      >
    > vehicle_table;
    vehicle_table _vehicle;

};

EOSIO_DISPATCH(memoize, (hi)(clear)(addplate)(delplate))
