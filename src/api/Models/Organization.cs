namespace Trey.Api.Models;

public class Person
{
  public required string Name { get; set; }
  public string? Email { get; set; }
  public string? Phone { get; set; }
  public string? TelegramNick { get; set; }
}

public class Facility
{
  public string? RoomCode { get; set; }
  public Person? ContactPerson { get; set; }
  public string? OtherInfo { get; set; }
}

public class TimeRange
{
  public DateTime Start { get; set; }
  public DateTime End { get; set; }
}

public class Organization
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public required string Name { get; set; }
  public string? ShortName { get; set; }
  public int? FoundingYear { get; set; }
  public required TimeRange OperatingPeriod { get; set; }
  public required string Email { get; set; }
  public required Person Chairperson { get; set; }
  public List<Person>? Boardmembers { get; set; }
  public int MemberCount { get; set; }
  public int? TreyMemberCount { get; set; }
  public string? IBAN { get; set; }
  public List<string>? ReservationRightsEmails { get; set; }
  public Dictionary<string, string>? EmailLists { get; set; }
  public Facility? AssociationFacility { get; set; }
}